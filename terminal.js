class TerminalGame {
    constructor() {
        this.currentLevel = 1;
        this.currentScreen = 'menu';
        this.unlockedData = new Set();
        
        // Initialize interfaces
        this.levelGenerator = new LevelGenerator();
        this.chatInterface = new ChatInterface(this.unlockedData);
        this.puzzleInterface = new PuzzleTerminal();
        
        this.initialize();
    }

    initialize() {
        const app = document.getElementById('app');
        if (!app) {
            console.error('App container not found');
            return;
        }

        // Set root CSS variables
        document.documentElement.style.setProperty('--color-bg', '#000000');
        document.documentElement.style.setProperty('--color-text', '#ffffff');
        document.documentElement.style.setProperty('--color-primary', '#ff0000');
        document.documentElement.style.setProperty('--color-secondary', '#00ff00');
        document.documentElement.style.setProperty('--color-tertiary', '#0000ff');
        document.documentElement.style.setProperty('--color-warning', '#ffff00');
        document.documentElement.style.setProperty('--color-error', '#ff0000');
        document.documentElement.style.setProperty('--color-success', '#00ff00');
        document.documentElement.style.setProperty('--glow-primary', '0 0 10px var(--color-primary)');
        document.documentElement.style.setProperty('--glow-secondary', '0 0 10px var(--color-secondary)');

        app.innerHTML = `
            <div class="terminal-container">
                <div class="main-menu">
                    <div class="title-logo">TEMPORA</div>
                    <div class="version-number">[v2157.3]</div>

                    <div class="system-status">
                        <div class="status-line">SYSTEM STATUS: ONLINE</div>
                        <div class="status-line">TEMPORAL INTEGRITY: 87.3%</div>
                        <div class="status-line warning">WARNING: TEMPORAL ANOMALIES DETECTED</div>
                    </div>

                    <div class="objective-box">
                        <div class="box-header">OBJECTIVE</div>
                        <div class="objective-list">
                            <div class="objective-item">► RECOVER CORRUPTED TEMPORAL DATA</div>
                            <div class="objective-item">► BREACH QUANTUM ENCRYPTION PROTOCOLS</div>
                            <div class="objective-item">► CURRENT SECURITY LEVEL: ${this.currentLevel}</div>
                        </div>
                        <div class="objective-warning">[!] CAUTION: TEMPORAL INSTABILITY DETECTED</div>
                    </div>

                    <div class="interface-options">
                        <div class="option-box" data-option="puzzle">
                            <div class="box-header">[1] SECURITY TERMINAL</div>
                            <div class="option-list">
                                <div class="option-item">› DECRYPT DATA</div>
                                <div class="option-item">› SOLVE PARADOXES</div>
                                <div class="option-item">› ACCESS MEMORIES</div>
                            </div>
                        </div>

                        <div class="option-box" data-option="chat">
                            <div class="box-header">[2] AI INTERFACE</div>
                            <div class="option-list">
                                <div class="option-item">› QUERY DATABASE</div>
                                <div class="option-item">› REQUEST ASSISTANCE</div>
                                <div class="option-item">› ANALYZE PATTERNS</div>
                            </div>
                        </div>
                    </div>

                    <div class="menu-footer">
                        [ PRESS 1 OR 2 TO SELECT INTERFACE ] [ ESC TO RETURN TO MAIN MENU ]
                    </div>
                </div>
                <div id="chat-terminal" class="hidden"></div>
                <div id="security-terminal" class="hidden"></div>
            </div>
        `;

        // Add base styles
        const styles = document.createElement('style');
        styles.textContent = `
            .terminal-container {
                height: 100vh;
                background: var(--color-bg);
                color: var(--color-text);
                font-family: 'Courier New', monospace;
            }

            .title-logo {
                font-size: 5em;
                color: var(--color-primary);
                text-shadow: var(--glow-primary);
                text-align: center;
                font-weight: bold;
                letter-spacing: 4px;
                margin: 40px 0 10px;
                padding: 20px;
                border: 4px solid var(--color-primary);
                box-shadow: var(--glow-primary);
            }

            .version-number {
                text-align: center;
                color: var(--color-primary);
                margin-bottom: 40px;
                opacity: 0.7;
            }

            .system-status {
                max-width: 600px;
                margin: 0 auto 40px;
                padding: 20px;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid var(--color-primary);
            }

            .status-line {
                margin: 10px 0;
                text-align: center;
            }

            .warning {
                color: var(--color-primary);
                animation: blink 1s infinite;
            }

            .interface-options {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin-bottom: 40px;
            }

            .option-box {
                width: 300px;
                padding: 20px;
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid var(--color-primary);
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .option-box:hover {
                background: rgba(255, 0, 0, 0.2);
                transform: translateY(-2px);
                box-shadow: var(--glow-primary);
            }

            .box-header {
                border-bottom: 1px solid var(--color-primary);
                padding-bottom: 10px;
                margin-bottom: 15px;
            }

            .option-item {
                margin: 10px 0;
                padding-left: 15px;
            }

            .menu-footer {
                position: fixed;
                bottom: 20px;
                left: 0;
                right: 0;
                text-align: center;
                color: var(--color-primary);
                opacity: 0.7;
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            .hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(styles);

        this.addEventListeners();
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.currentScreen === 'menu') {
                if (e.key === '1') {
                    this.showSecurityTerminal();
                } else if (e.key === '2') {
                    this.showChatTerminal();
                }
            } else if (e.key === 'Escape') {
                this.showMenu();
            }
        });

        const optionBoxes = document.querySelectorAll('.option-box');
        optionBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const option = box.dataset.option;
                if (option === 'puzzle') {
                    this.showSecurityTerminal();
                } else if (option === 'chat') {
                    this.showChatTerminal();
                }
            });
        });
    }

    showMenu() {
        this.currentScreen = 'menu';
        const chatTerminal = document.getElementById('chat-terminal');
        const securityTerminal = document.getElementById('security-terminal');
        const mainMenu = document.querySelector('.main-menu');
        
        if (chatTerminal) chatTerminal.classList.add('hidden');
        if (securityTerminal) securityTerminal.classList.add('hidden');
        if (mainMenu) mainMenu.classList.remove('hidden');
    }

    showChatTerminal() {
        console.log('Showing chat terminal...');
        this.currentScreen = 'chat';
        document.querySelector('.main-menu').classList.add('hidden');
        document.getElementById('security-terminal').classList.add('hidden');
        const chatTerminal = document.getElementById('chat-terminal');
        chatTerminal.classList.remove('hidden');
        if (this.chatInterface) {
            this.chatInterface.initializeChatTerminal();
        }
    }

    showSecurityTerminal() {
        const terminal = document.getElementById('terminal');
        if (!terminal) return;

        // Initialize puzzle with current level
        const puzzleData = this.puzzleInterface.initializePuzzleTerminal(this.currentLevel);
        
        terminal.innerHTML = `
            <div class="security-terminal">
                <div class="terminal-header">
                    <div class="title">SECURITY TERMINAL - LEVEL ${this.currentLevel}</div>
                    <div class="message">${puzzleData.message}</div>
                </div>
                <div class="number-grid">
                    ${this.generateNumberGrid(puzzleData.gridSize)}
                </div>
                <div class="terminal-footer">
                    <div class="attempts">Attempts remaining: ${puzzleData.maxAttempts}</div>
                    <div class="hint">${puzzleData.hint}</div>
                </div>
            </div>
        `;

        this.addSecurityTerminalListeners();
    }

    getMainMenuStyles() {
        return `
            .terminal-container {
                height: 100vh;
                background: var(--color-bg);
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Courier New', monospace;
                color: var(--color-text);
                overflow: hidden;
            }

            .main-menu {
                width: 90%;
                max-width: 1200px;
                padding: 40px;
                position: relative;
            }

            .title-logo {
                font-size: 5em;
                color: var(--color-primary);
                text-shadow: 0 0 20px var(--color-primary);
                text-align: center;
                font-weight: bold;
                letter-spacing: 4px;
                margin-bottom: 10px;
                border: 4px solid var(--color-primary);
                padding: 10px 40px;
                box-shadow: 0 0 20px var(--color-primary);
                animation: logoGlow 2s infinite;
            }

            .version-number {
                color: var(--color-primary);
                text-align: center;
                opacity: 0.7;
                margin: 10px 0 40px 0;
            }

            .system-status {
                text-align: center;
                margin-bottom: 40px;
            }

            .status-line {
                margin: 5px 0;
            }

            .warning {
                color: var(--color-primary);
                animation: blink 1s infinite;
            }

            .objective-box {
                border: 2px solid var(--color-text);
                padding: 25px;
                margin: 0 auto 40px auto;
                max-width: 800px;
                background: rgba(0, 0, 0, 0.5);
            }

            .box-header {
                border-bottom: 1px solid var(--color-text);
                padding-bottom: 10px;
                margin-bottom: 15px;
            }

            .interface-options {
                display: flex;
                justify-content: center;
                gap: 60px;
                margin-bottom: 40px;
            }

            .option-box {
                border: 2px solid var(--color-text);
                padding: 25px;
                width: 300px;
                background: rgba(0, 0, 0, 0.5);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .option-box:hover {
                border-color: var(--color-primary);
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                transform: translateY(-2px);
            }

            .option-box::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    120deg,
                    transparent,
                    rgba(255, 0, 0, 0.1),
                    transparent
                );
                transition: 0.5s;
            }

            .option-box:hover::before {
                left: 100%;
            }

            .option-item {
                margin: 12px 0;
                padding-left: 15px;
                position: relative;
            }

            .option-item::before {
                content: '›';
                position: absolute;
                left: 0;
                color: var(--color-primary);
            }

            .menu-footer {
                text-align: center;
                color: #666;
                position: absolute;
                bottom: 20px;
                left: 0;
                right: 0;
                font-size: 0.9em;
            }

            .hidden {
                display: none !important;
            }

            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }

            @keyframes logoGlow {
                0%, 100% { text-shadow: 0 0 20px var(--color-primary); }
                50% { text-shadow: 0 0 30px var(--color-primary); }
            }

            @keyframes scanline {
                0% { transform: translateY(0); }
                100% { transform: translateY(100vh); }
            }

            .terminal-container::before {
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
                opacity: 0.1;
                animation: scanline 10s linear infinite;
            }
        `;
    }

    // ... rest of the terminal.js code remains the same ...
}