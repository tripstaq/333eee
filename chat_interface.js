class ChatInterface {
    constructor(unlockedData) {
        // Initialize core properties
        this.unlockedData = unlockedData;
        this.currentLevel = 1;
        this.messageHistory = [];
        this.isCommandRefVisible = false;
        
        // Initialize game state
        this.gameState = {
            decryptedCodes: new Set(),
            discoveredAnomalies: new Set(),
            temporalFragments: new Map(),
            currentPuzzle: null,
            hints: 3
        };

        // Initialize level requirements
        this.levelRequirements = {
            1: { fragments: 2, anomalies: 1, codes: 1 },
            2: { fragments: 3, anomalies: 2, codes: 2 },
            3: { fragments: 4, anomalies: 3, codes: 3 }
        };

        // Initialize temporal codes
        this.temporalCodes = {
            1: ['AA395B41620BC73E', 'FF872C90134AD45B'],
            2: ['CC671D23458EF90A', 'BB234E78901CD56F'],
            3: ['DD789A12345BC67E', 'EE123F45678AD90B']
        };

        // Initialize anomalies
        this.anomalies = {
            1: ['paradox-alpha', 'timeline-breach'],
            2: ['quantum-shift', 'causality-break'],
            3: ['entropy-cascade', 'temporal-loop']
        };

        try {
            this.levelGenerator = new LevelGenerator();
        } catch (error) {
            console.warn('LevelGenerator not available:', error);
        }

        // AI Personality traits
        this.personality = {
            traits: {
                analytical: 0.9,    // Highly analytical
                cryptic: 0.7,       // Somewhat cryptic
                technical: 0.8,     // Very technical
                helpful: 0.6        // Moderately helpful
            },
            knowledge: {
                temporal: true,
                quantum: true,
                encryption: true,
                paradox: true
            }
        };
    }

    initializeChatTerminal() {
        try {
            const chatTerminal = document.getElementById('chat-terminal');
            if (!chatTerminal) {
                throw new Error('Chat terminal element not found');
            }

            // Ensure all required properties exist
            if (!this.gameState || !this.levelRequirements || !this.currentLevel) {
                throw new Error('Required game properties not initialized');
            }

            // Get current level requirements safely
            const currentLevelReq = this.levelRequirements[this.currentLevel] || 
                                  { fragments: 0, anomalies: 0, codes: 0 };

            chatTerminal.innerHTML = `
                <div class="chat-interface">
                    <div class="chat-header">
                        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                        █           TEMPORAL AI INTERFACE - LEVEL ${this.currentLevel}        █
                        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                    </div>

                    <div class="interface-grid">
                        <div class="left-panel">
                            <div class="ai-visual">
                                <div class="ascii-entity">
                                    <pre class="entity-layer base">
   ▄███████▄
 ▄██▀▀▀▀▀▀▀██▄
██▀  ▄▄▄▄▄  ▀██
██  ▐█████▌  ██
██  ▐█████▌  ██
██  ▐█████▌  ██
██▄  ▀▀▀▀▀  ▄██
 ▀██▄▄▄▄▄▄▄██▀
   ▀███████▀
                                    </pre>
                                </div>
                            </div>
                            <div class="system-status">
                                <div class="status-item">NEURAL LINK: ACTIVE</div>
                                <div class="status-item">TEMPORAL SYNC: 87.3%</div>
                                <div class="status-item warning">ANOMALIES DETECTED</div>
                            </div>
                            <div class="command-tab" id="command-tab">
                                [ COMMAND REFERENCE - CLICK TO ${this.isCommandRefVisible ? 'HIDE' : 'SHOW'} ]
                            </div>
                            <div class="command-reference ${this.isCommandRefVisible ? '' : 'hidden'}" id="command-reference">
                                <pre class="command-list">
SCAN     : detect anomalies
ANALYZE  : examine target
DECRYPT  : process codes
STATUS   : view progress
HINT     : get help [${this.gameState?.hints || 3}]
                                </pre>
                                <div class="level-info">
                                    <div class="info-header">[ LEVEL ${this.currentLevel} ]</div>
                                    <pre class="level-data">
CODES     : ${this.gameState?.decryptedCodes?.size || 0}/${this.levelRequirements[this.currentLevel].codes}
ANOMALIES : ${this.gameState?.discoveredAnomalies?.size || 0}/${this.levelRequirements[this.currentLevel].anomalies}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div class="chat-container">
                            <div class="terminal-window">
                                <div class="terminal-header">
                                    <span class="terminal-title">TEMPORAL AI v2.157.3</span>
                                    <div class="terminal-controls">
                                        <span class="control-dot"></span>
                                        <span class="control-dot"></span>
                                        <span class="control-dot"></span>
                                    </div>
                                </div>
                                <div class="chat-messages" id="chat-messages">
                                    <div class="message system">
                                        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                                        TEMPORAL AI INTERFACE INITIALIZED...
                                        ESTABLISHING SECURE CONNECTION...
                                        QUANTUM ENCRYPTION ACTIVE
                                        NEURAL LINK ESTABLISHED
                                        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                                    </div>
                                    <div class="message ai">
                                        <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                                        Greetings. I am the Temporal AI assigned to assist with data recovery 
                                        and temporal anomaly analysis. How may I help you?
                                    </div>
                                </div>
                                <div class="chat-input-container">
                                    <span class="prompt">T.AI >></span>
                                    <input type="text" id="message-input" class="chat-input" 
                                           placeholder="Enter command..." autocomplete="off">
                                </div>
                            </div>
                        </div>

                        <div class="right-panel">
                            <div class="data-terminal">
                                <div class="terminal-header">
                                    <span class="terminal-title">RECOVERED DATA FRAGMENTS</span>
                                    <div class="terminal-controls">
                                        <span class="control-dot"></span>
                                        <span class="control-dot"></span>
                                        <span class="control-dot"></span>
                                    </div>
                                </div>
                                <div class="data-content" id="data-fragments">
                                    <div class="data-status">
                                        <span class="status-icon">⚠</span>
                                        No temporal data fragments recovered yet.
                                        <div class="scan-line"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add styles and event listeners
            this.addStyles();
            this.addEventListeners();

        } catch (error) {
            console.error('Error initializing chat terminal:', error);
            const chatTerminal = document.getElementById('chat-terminal');
            if (chatTerminal) {
                chatTerminal.innerHTML = `
                    <div class="error-message" style="color: red; padding: 20px;">
                        Error initializing chat terminal: ${error.message}
                        <br>
                        Please try again or contact system administrator.
                    </div>
                `;
            }
        }
    }

    handleMessage(message) {
        const messages = document.getElementById('chat-messages');
        if (!messages) return;

        // Add user message with timestamp
        messages.innerHTML += `
            <div class="message user">
                <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                ${this.escapeHtml(message)}
            </div>
        `;

        // Generate AI response
        const response = this.generateAIResponse(message);
        
        // Add AI response with timestamp
        messages.innerHTML += `
            <div class="message ai">
                <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                ${response}
            </div>
        `;

        // Scroll to bottom
        messages.scrollTop = messages.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    addEventListeners() {
        const input = document.getElementById('message-input');
        const commandTab = document.getElementById('command-tab');
        const commandRef = document.getElementById('command-reference');

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    this.handleMessage(input.value.trim());
                    input.value = '';
                }
            });
        }

        if (commandTab) {
            commandTab.addEventListener('click', () => {
                this.isCommandRefVisible = !this.isCommandRefVisible;
                commandRef.classList.toggle('hidden');
                commandTab.textContent = `[ COMMAND REFERENCE - CLICK TO ${this.isCommandRefVisible ? 'HIDE' : 'SHOW'} ]`;
            });
        }
    }

    renderDataFragments() {
        if (this.unlockedData.size > 0) {
            return Array.from(this.unlockedData).map(fragment => `
                <div class="data-fragment">
                    <div class="fragment-header">TEMPORAL FRAGMENT</div>
                    <div class="fragment-content">${fragment}</div>
                </div>
            `).join('');
        } else {
            return '<div class="no-data">No temporal data fragments recovered yet.</div>';
        }
    }

    addStyles() {
        // Add new styles for command reference
        const styles = document.createElement('style');
        styles.textContent = `
            .command-tab {
                margin-top: 10px;
                padding: 5px 10px;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid var(--color-primary);
                cursor: pointer;
                text-align: center;
                transition: all 0.3s ease;
                color: var(--color-primary);
            }

            .command-tab:hover {
                background: rgba(255, 0, 0, 0.2);
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
            }

            .command-reference {
                margin-top: 5px;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--color-primary);
                transition: all 0.3s ease;
                overflow: hidden;
            }

            .command-reference.hidden {
                height: 0;
                padding: 0;
                margin: 0;
                border: none;
            }

            .chat-messages {
                font-family: 'Courier New', monospace;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--color-primary);
                height: calc(100% - 50px);
                overflow-y: auto;
            }

            .chat-input-container {
                display: flex;
                align-items: center;
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid var(--color-primary);
                margin-top: 5px;
            }

            .prompt {
                color: var(--color-primary);
                margin-right: 10px;
                font-family: 'Courier New', monospace;
            }

            .chat-input {
                background: transparent;
                border: none;
                color: var(--color-text);
                font-family: 'Courier New', monospace;
                width: 100%;
                padding: 0;
            }

            .chat-input:focus {
                outline: none;
            }

            .message {
                padding: 5px 0;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
            }

            .message.user {
                color: var(--color-text);
            }

            .message.user::before {
                content: ">> ";
                color: var(--color-primary);
            }

            .message.ai {
                color: var(--color-secondary);
            }

            .message.system {
                color: var(--color-primary);
            }

            .terminal-window, .data-terminal {
                background: rgba(0, 0, 0, 0.85);
                border: 1px solid var(--color-primary);
                border-radius: 5px;
                overflow: hidden;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .terminal-header {
                background: rgba(255, 0, 0, 0.15);
                padding: 8px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--color-primary);
            }

            .terminal-title {
                color: var(--color-primary);
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
            }

            .terminal-controls {
                display: flex;
                gap: 5px;
            }

            .control-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--color-primary);
                opacity: 0.7;
            }

            .chat-messages {
                flex-grow: 1;
                padding: 15px;
                overflow-y: auto;
                font-family: 'Courier New', monospace;
                line-height: 1.4;
                background: transparent;
            }

            .message {
                margin-bottom: 15px;
                padding: 5px 10px;
                border-left: 2px solid transparent;
                animation: fadeIn 0.3s ease;
            }

            .message.system {
                color: var(--color-primary);
                white-space: pre;
                border-left-color: var(--color-primary);
            }

            .message.ai {
                color: var(--color-secondary);
                border-left-color: var(--color-secondary);
            }

            .message.user {
                color: var(--color-text);
                border-left-color: var(--color-text);
            }

            .timestamp {
                color: rgba(255, 255, 255, 0.5);
                font-size: 0.8em;
                margin-right: 10px;
            }

            .chat-input-container {
                padding: 15px;
                background: rgba(0, 0, 0, 0.3);
                border-top: 1px solid var(--color-primary);
                display: flex;
                align-items: center;
            }

            .prompt {
                color: var(--color-primary);
                margin-right: 10px;
                font-family: 'Courier New', monospace;
                font-weight: bold;
            }

            .chat-input {
                background: transparent;
                border: none;
                color: var(--color-text);
                font-family: 'Courier New', monospace;
                width: 100%;
                font-size: 1em;
            }

            .chat-input:focus {
                outline: none;
            }

            .data-content {
                padding: 15px;
                height: 100%;
                overflow-y: auto;
            }

            .data-status {
                text-align: center;
                color: var(--color-text);
                opacity: 0.7;
                padding: 20px;
                position: relative;
            }

            .status-icon {
                display: block;
                font-size: 2em;
                margin-bottom: 10px;
                color: var(--color-primary);
            }

            .scan-line {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: var(--color-primary);
                opacity: 0.5;
                animation: scan 2s linear infinite;
            }

            @keyframes scan {
                0% { transform: translateY(0); }
                100% { transform: translateY(100%); }
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
        `;
        document.head.appendChild(styles);
    }
}

console.log('ChatInterface.js loaded');