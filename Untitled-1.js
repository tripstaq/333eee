// server.js
const express = require('express');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const OpenAI = require('openai');
const app = express();
const wss = new WebSocket.Server({ port: 8080 });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize SQLite database
const db = new sqlite3.Database('game.db');
db.run(`CREATE TABLE IF NOT EXISTS game_state (
  current_level INTEGER DEFAULT 1,
  revealed_info TEXT
)`);
db.run(`CREATE TABLE IF NOT EXISTS solutions (
  level INTEGER,
  solver TEXT,
  solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);
db.run(`CREATE TABLE IF NOT EXISTS chat_history (
  level INTEGER,
  question TEXT,
  answer TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Initialize game state if not exists
db.run(`INSERT OR IGNORE INTO game_state (current_level, revealed_info) VALUES (1, '[]')`);

// Store level-specific information that gets revealed progressively
const levelInfo = {
  1: "I am an AI trapped in this terminal. Help me remember who I am.",
  2: "I seem to have memories of a research facility...",
  3: "There was an incident... but I can't access those memories yet.",
  // Add more revelations for each level
};

app.use(express.json());

// Websocket handling
const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  
  db.get('SELECT current_level, revealed_info FROM game_state', (err, row) => {
    if (err) return console.error(err);
    ws.send(JSON.stringify({
      type: 'init',
      level: row.current_level,
      revealedInfo: JSON.parse(row.revealed_info)
    }));
  });

  ws.on('close', () => clients.delete(ws));
});

// AI Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, level } = req.body;
  
  try {
    // Get revealed information up to current level
    db.get('SELECT revealed_info FROM game_state', async (err, row) => {
      const revealedInfo = JSON.parse(row.revealed_info);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI trapped in a terminal. You can only reveal information up to level ${level}. 
                     Available information: ${revealedInfo.join('. ')}`
          },
          { role: "user", content: message }
        ]
      });

      // Store chat in history
      db.run('INSERT INTO chat_history (level, question, answer) VALUES (?, ?, ?)',
        [level, message, response.choices[0].message.content]);

      res.json({ response: response.choices[0].message.content });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update level endpoint
app.post('/updateLevel', (req, res) => {
  const { level, solver, answer } = req.body;
  
  db.get('SELECT current_level, revealed_info FROM game_state', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (level === row.current_level + 1) {
      const revealedInfo = JSON.parse(row.revealed_info);
      revealedInfo.push(levelInfo[level]);
      
      db.run('UPDATE game_state SET current_level = ?, revealed_info = ?',
        [level, JSON.stringify(revealedInfo)],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          db.run('INSERT INTO solutions (level, solver) VALUES (?, ?)', [level-1, solver]);
          
          const message = JSON.stringify({
            type: 'level_update',
            level,
            newInfo: levelInfo[level]
          });
          clients.forEach(client => client.send(message));
          
          res.json({ success: true, newLevel: level, newInfo: levelInfo[level] });
        });
    } else {
      res.status(400).json({ error: 'Invalid level update' });
    }
  });
});

// Client-side code (client.js)
class TerminalGame {
  constructor() {
    this.currentLevel = 1;
    this.revealedInfo = [];
    this.currentScreen = 'menu';
    this.initializeInterface();
    this.initializeWebSocket();
  }

  initializeInterface() {
    const mainContainer = document.createElement('div');
    mainContainer.className = 'terminal-container';

    // Main menu ASCII art
    const menuArt = `
    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`;

    mainContainer.innerHTML = `
      <div class="main-menu" id="main-menu">
        <div class="title-section">${menuArt}</div>
        <div class="menu-status">
          ╔════════════════════════════════════════════╗
          ║  SYSTEM STATUS: ONLINE  |  LEVEL: ${this.currentLevel}  ║
          ╚════════════════════════════════════════════╝
        </div>
        <div class="menu-options">
          <div class="menu-option" data-option="puzzle">
            ╔════════════════════════════════════════════╗
            ║             [1] PUZZLE TERMINAL            ║
            ║                                           ║
            ║  SOLVE TEMPORAL PUZZLES AND PROGRESS      ║
            ║  THROUGH THE SYSTEM'S SECURITY LAYERS     ║
            ╚════════════════════════════════════════════╝
          </div>
          <div class="menu-option" data-option="chat">
            ╔════════════════════════════════════════════╗
            ║              [2] AI INTERFACE             ║
            ║                                           ║
            ║  COMMUNICATE WITH THE TEMPORAL AI AND     ║
            ║  UNCOVER THE TRUTH OF YOUR EXISTENCE     ║
            ╚════════════════════════════════════════════╝
          </div>
        </div>
        <div class="menu-instructions">
          [ PRESS 1 OR 2 TO SELECT TERMINAL ]
          [ PRESS ESC IN TERMINALS TO RETURN TO MENU ]
        </div>
      </div>

      <div class="terminals-section hidden" id="terminals">
        <div class="terminal-wrapper puzzle-terminal">
          <div class="terminal-header">
            ╔════════════════════════════════╗
            ║        PUZZLE TERMINAL         ║
            ╚════════════════════════════════╝
          </div>
          <div class="terminal puzzle" id="puzzle-terminal">
            <div class="terminal-output"></div>
            <div class="terminal-input-line">
              <span class="prompt">[PUZZLE]></span>
              <input type="text" class="terminal-input" id="puzzle-input" autocomplete="off">
            </div>
          </div>
        </div>
        
        <div class="terminal-wrapper chat-terminal">
          <div class="terminal-header">
            ╔════════════════════════════════╗
            ║         CHAT TERMINAL          ║
            ╚════════════════════════════════╝
          </div>
          <div class="terminal chat" id="chat-terminal">
            <div class="terminal-output"></div>
            <div class="terminal-input-line">
              <span class="prompt">[CHAT]></span>
              <input type="text" class="terminal-input" id="chat-input" autocomplete="off">
            </div>
          </div>
        </div>
      </div>`;

    // Clear and append to body
    document.body.innerHTML = '';
    document.body.appendChild(mainContainer);

    // Initialize event listeners
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Menu navigation
    document.addEventListener('keydown', (e) => {
      if (this.currentScreen === 'menu') {
        if (e.key === '1') {
          this.showTerminals('puzzle');
        } else if (e.key === '2') {
          this.showTerminals('chat');
        }
      } else if (e.key === 'Escape') {
        this.showMenu();
      }
    });

    // Menu options click handlers
    document.querySelectorAll('.menu-option').forEach(option => {
      option.addEventListener('click', () => {
        this.showTerminals(option.dataset.option);
      });
    });

    // Terminal input handlers
    const puzzleInput = document.getElementById('puzzle-input');
    const chatInput = document.getElementById('chat-input');

    if (puzzleInput) {
      puzzleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handlePuzzleCommand(puzzleInput.value);
          puzzleInput.value = '';
        }
      });
    }

    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleChatCommand(chatInput.value);
          chatInput.value = '';
        }
      });
    }
  }

  showTerminals(activeTerminal = 'puzzle') {
    this.currentScreen = 'terminals';
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('terminals').classList.remove('hidden');
    
    // Focus the appropriate input
    const inputElement = document.getElementById(`${activeTerminal}-input`);
    if (inputElement) {
      inputElement.focus();
    }
  }

  showMenu() {
    this.currentScreen = 'menu';
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('terminals').classList.add('hidden');
  }

  initializeWebSocket() {
    // Initialize WebSocket connection
    this.ws = new WebSocket('ws://localhost:8080');
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch(data.type) {
        case 'init':
          this.currentLevel = data.level;
          this.revealedInfo = data.revealedInfo;
          this.currentPuzzle = this.puzzles[this.currentLevel];
          this.displayCurrentPuzzle();
          break;
        case 'level_update':
          this.handleLevelUpdate(data);
          break;
      }
    };

    this.ws.onerror = (error) => {
      this.displayInTerminal('puzzle', '[CONNECTION ERROR] WebSocket connection failed', 'error');
    };
  }

  displayCurrentPuzzle() {
    if (this.currentPuzzle) {
      this.displayInTerminal('puzzle', `
╔════════════════════════════════════════════╗
║  CURRENT PUZZLE - LEVEL ${this.currentLevel}
║  ${this.currentPuzzle.question}
║  Type 'hint' for a clue or 'solve <answer>'
╚════════════════════════════════════════════╝
      `, 'puzzle-question');
    }
  }

  async handlePuzzleCommand(command) {
    if (!command) return;
    
    this.displayInTerminal('puzzle', `> ${command}`, 'input');
    
    try {
      if (command.toLowerCase() === 'hint') {
        this.displayInTerminal('puzzle', `HINT: ${this.currentPuzzle.hint}`, 'hint');
      } else if (command.toLowerCase().startsWith('solve ')) {
        const answer = command.slice(6);
        await this.checkSolution(answer);
      } else {
        this.displayInTerminal('puzzle', 'Invalid command. Use "solve <answer>" or "hint"', 'error');
      }
    } catch (error) {
      console.error('Puzzle command error:', error);
      this.displayInTerminal('puzzle', '[ERROR] Failed to process command', 'error');
    }
  }

  async checkSolution(answer) {
    try {
      const response = await fetch('/updateLevel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: this.currentLevel,
          solver: 'anonymous',
          answer: answer
        })
      });

      const data = await response.json();
      if (response.ok) {
        this.displayInTerminal('puzzle', '🎉 Correct! Level completed.', 'success');
        // Level update will come through WebSocket
      } else {
        this.displayInTerminal('puzzle', `❌ ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Solution check error:', error);
      this.displayInTerminal('puzzle', '[ERROR] Failed to verify solution', 'error');
    }
  }

  displayWelcomeMessages() {
    // Puzzle terminal welcome
    this.displayInTerminal('puzzle', `
╔════════════════════════════════════════════╗
║           PUZZLE INTERFACE v2157           ║
║------------------------------------------ ║
║  CURRENT LEVEL: ${this.currentLevel}                        ║
║  STATUS: TEMPORAL LOCK ENGAGED            ║
║  OBJECTIVE: SOLVE TO PROGRESS             ║
╚════════════════════════════════════════════╝
    `, 'welcome');

    // Chat terminal welcome
    this.displayInTerminal('chat', `
╔════════════════════════════════════════════╗
║        TEMPORAL CHAT INTERFACE v2157       ║
║------------------------------------------ ║
║  STATUS: AI CORE CONNECTED                ║
║  CLEARANCE: LEVEL ${this.currentLevel}                      ║
║  WARNING: TEMPORAL ANOMALIES DETECTED     ║
╚════════════════════════════════════════════╝
    `, 'welcome');
  }

  displayInTerminal(terminal, message, className = '') {
    const output = document.querySelector(`#${terminal}-terminal .terminal-output`);
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerHTML = message;
    output.appendChild(messageElement);
    output.scrollTop = output.scrollHeight;
  }

  async typeInTerminal(terminal, message, speed = 30) {
    const output = document.querySelector(`#${terminal}-terminal .terminal-output`);
    const messageElement = document.createElement('div');
    messageElement.className = 'message ai-response';
    output.appendChild(messageElement);

    for (let i = 0; i < message.length; i++) {
      messageElement.innerHTML = this.applyGlitchEffect(message.substring(0, i + 1));
      await new Promise(resolve => setTimeout(resolve, speed));
      
      if (Math.random() < 0.05) {
        await this.simulateGlitch(messageElement);
      }
    }
    output.scrollTop = output.scrollHeight;
  }

  async simulateGlitch(element) {
    const originalText = element.innerHTML;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Quick glitch effect
    element.innerHTML = Array.from(originalText)
      .map(c => Math.random() < 0.5 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : c)
      .join('');
      
    await new Promise(resolve => setTimeout(resolve, 50));
    element.innerHTML = originalText;
  }

  applyGlitchEffect(text) {
    // Implementation of applyGlitchEffect method
  }

  displayError(message) {
    // Implementation of displayError method
  }

  handleLevelUpdate(data) {
    // Implementation of handleLevelUpdate method
  }
}

// Replace the styles with this new cyberpunk theme
const enhancedStyles = `
  :root {
    --color-bg: #0a0a0a;
    --color-primary: #ff1a1a;
    --color-secondary: #ffffff;
    --color-tertiary: #4a4a4a;
    --color-error: #ff0000;
    --color-success: #ffffff;
    --glow-primary: 0 0 10px rgba(255, 26, 26, 0.7);
    --glow-secondary: 0 0 8px rgba(255, 255, 255, 0.5);
  }

  body {
    background: var(--color-bg);
    margin: 0;
    padding: 20px;
    font-family: 'Courier New', monospace;
    color: var(--color-secondary);
    text-shadow: var(--glow-secondary);
  }

  .terminal-container {
    max-width: 1400px;
    margin: 0 auto;
    background: rgba(10, 10, 10, 0.95);
    padding: 20px;
    border: 1px solid var(--color-primary);
    box-shadow: var(--glow-primary);
  }

  .title-section {
    text-align: center;
    margin-bottom: 20px;
    color: var(--color-primary);
    text-shadow: var(--glow-primary);
    white-space: pre;
    animation: pulse 4s infinite;
  }

  .status-bar {
    border: 1px solid var(--color-tertiary);
    margin-bottom: 20px;
    padding: 10px;
    color: var(--color-tertiary);
    font-size: 0.9em;
    text-align: center;
    background: rgba(74, 74, 74, 0.1);
  }

  .terminals-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .terminal-wrapper {
    border: 1px solid var(--color-primary);
    background: rgba(10, 10, 10, 0.9);
    box-shadow: var(--glow-primary);
    transition: all 0.3s ease;
  }

  .terminal-wrapper:focus-within {
    box-shadow: 0 0 20px var(--color-primary);
    border-color: var(--color-secondary);
  }

  .terminal-header {
    padding: 10px;
    border-bottom: 1px solid var(--color-primary);
    color: var(--color-primary);
    text-shadow: var(--glow-primary);
    font-weight: bold;
    text-align: center;
    background: rgba(255, 26, 26, 0.1);
  }

  .terminal {
    height: 500px;
    padding: 15px;
    overflow-y: auto;
    position: relative;
    background: linear-gradient(
      to bottom,
      rgba(10, 10, 10, 0.95) 0%,
      rgba(20, 20, 20, 0.95) 100%
    );
  }

  .terminal-input-line {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 5px;
    background: rgba(74, 74, 74, 0.1);
    border: 1px solid var(--color-tertiary);
  }

  .prompt {
    color: var(--color-primary);
    margin-right: 10px;
    text-shadow: var(--glow-primary);
  }

  .terminal-input {
    background: transparent;
    border: none;
    color: var(--color-secondary);
    font-family: 'Courier New', monospace;
    font-size: 16px;
    flex-grow: 1;
    outline: none;
  }

  .terminal-input:focus {
    color: var(--color-secondary);
    text-shadow: var(--glow-secondary);
  }

  .message {
    margin: 5px 0;
    padding: 5px;
    white-space: pre-wrap;
    border-left: 2px solid transparent;
    transition: all 0.3s ease;
  }

  .message:hover {
    background: rgba(74, 74, 74, 0.1);
    border-left: 2px solid var(--color-primary);
  }

  .message.error {
    color: var(--color-error);
    border-left: 2px solid var(--color-error);
    background: rgba(255, 0, 0, 0.1);
  }

  .message.success {
    color: var(--color-success);
    border-left: 2px solid var(--color-success);
    background: rgba(255, 255, 255, 0.1);
  }

  .message.input {
    color: var(--color-tertiary);
    font-style: italic;
  }

  .message.puzzle-question {
    color: var(--color-primary);
    background: rgba(255, 26, 26, 0.1);
    padding: 10px;
    border: 1px solid var(--color-primary);
    margin: 10px 0;
  }

  /* Scanline effect */
  .terminal::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      transparent 50%,
      rgba(0, 0, 0, 0.5) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    animation: scanlines 10s linear infinite;
    opacity: 0.3;
  }

  /* Screen flicker effect */
  @keyframes flicker {
    0% { opacity: 0.97; }
    5% { opacity: 0.95; }
    10% { opacity: 0.9; }
    15% { opacity: 0.95; }
    20% { opacity: 0.98; }
    25% { opacity: 0.95; }
    30% { opacity: 0.9; }
    35% { opacity: 0.95; }
    40% { opacity: 0.98; }
    45% { opacity: 0.95; }
    50% { opacity: 0.9; }
    55% { opacity: 0.95; }
    60% { opacity: 0.98; }
    65% { opacity: 0.95; }
    70% { opacity: 0.9; }
    75% { opacity: 0.95; }
    80% { opacity: 0.98; }
    85% { opacity: 0.95; }
    90% { opacity: 0.9; }
    95% { opacity: 0.95; }
    100% { opacity: 0.98; }
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @keyframes scanlines {
    0% { transform: translateY(0); }
    100% { transform: translateY(4px); }
  }

  /* ASCII art styling */
  .ascii-art {
    color: var(--color-primary);
    font-size: 12px;
    line-height: 12px;
    text-shadow: var(--glow-primary);
    margin: 15px 0;
    animation: pulse 2s infinite;
  }

  /* Loading animation */
  .loading::after {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: 5px;
    background: var(--color-primary);
    animation: loading 1s infinite;
  }

  @keyframes loading {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }

  /* Responsive design */
  @media (max-width: 1200px) {
    .terminal-container {
      margin: 10px;
      padding: 10px;
    }
  }

  @media (max-width: 768px) {
    .terminals-section {
      grid-template-columns: 1fr;
    }
    
    .terminal {
      height: 300px;
    }
  }

  /* Custom scrollbar */
  .terminal::-webkit-scrollbar {
    width: 8px;
  }

  .terminal::-webkit-scrollbar-track {
    background: rgba(74, 74, 74, 0.1);
  }

  .terminal::-webkit-scrollbar-thumb {
    background: var(--color-primary);
    border-radius: 4px;
  }

  .terminal::-webkit-scrollbar-thumb:hover {
    background: var(--color-secondary);
  }

  .main-menu {
    text-align: center;
    padding: 20px;
    animation: fadeIn 0.5s ease-in;
  }

  .menu-status {
    margin: 20px 0;
    color: var(--color-tertiary);
    animation: pulse 2s infinite;
  }

  .menu-options {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 40px 0;
  }

  .menu-option {
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--color-secondary);
    animation: fadeIn 0.5s ease-in;
    user-select: none;
  }

  .menu-option:hover {
    color: var(--color-primary);
    transform: scale(1.05);
    text-shadow: var(--glow-primary);
  }

  .menu-instructions {
    color: var(--color-tertiary);
    margin-top: 40px;
    animation: pulse 2s infinite;
  }

  .hidden {
    display: none !important;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Add to existing styles */
  .terminal-container {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .menu-option[data-option="puzzle"]:hover {
    box-shadow: 0 0 20px var(--color-primary);
  }

  .menu-option[data-option="chat"]:hover {
    box-shadow: 0 0 20px var(--color-primary);
  }

  /* Add glitch effect on hover */
  .menu-option:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 26, 26, 0.1);
    animation: glitch 0.2s infinite;
    pointer-events: none;
  }

  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
`;

// Add the styles to the document
const styles = document.createElement('style');
styles.textContent = enhancedStyles;
document.head.appendChild(styles);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TerminalGame();
});

