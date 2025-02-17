class PuzzleTerminal {
    constructor() {
        this.currentLevel = 1;
        this.unlockedData = new Set();
        this.temporalFragments = new Map();
        this.decryptionProgress = 0;
    }

    initializePuzzleTerminal() {
        try {
            const securityTerminal = document.getElementById('security-terminal');
            if (!securityTerminal) {
                throw new Error('Security terminal element not found');
            }

            securityTerminal.innerHTML = `
                <div class="puzzle-interface">
                    <div class="puzzle-header">
                        ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                        █         SECURITY TERMINAL - LEVEL ${this.currentLevel}          █
                        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                    </div>

                    <div class="puzzle-grid">
                        <div class="left-panel">
                            <div class="security-status">
                                <div class="status-header">SECURITY STATUS</div>
                                <div class="status-item">ENCRYPTION: ACTIVE</div>
                                <div class="status-item">FIREWALL: ENGAGED</div>
                                <div class="status-item warning">BREACH ATTEMPTS DETECTED</div>
                            </div>
                            <div class="decryption-progress">
                                <div class="progress-header">DECRYPTION PROGRESS</div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${this.decryptionProgress}%"></div>
                                </div>
                                <div class="progress-text">${this.decryptionProgress}%</div>
                            </div>
                        </div>

                        <div class="puzzle-container">
                            <div class="puzzle-area" id="puzzle-area">
                                <div class="puzzle-message">INITIALIZING SECURITY PROTOCOLS...</div>
                                <div class="puzzle-grid-container" id="puzzle-grid">
                                    <!-- Puzzle grid will be generated here -->
                                </div>
                            </div>
                            <div class="puzzle-controls">
                                <input type="text" id="puzzle-input" class="puzzle-input" 
                                    placeholder="Enter decryption sequence..." autocomplete="off">
                                <button id="decrypt-button" class="decrypt-button">DECRYPT</button>
                            </div>
                        </div>

                        <div class="right-panel">
                            <div class="temporal-fragments">
                                <div class="panel-header">TEMPORAL FRAGMENTS</div>
                                <div class="fragment-list" id="fragment-list">
                                    <div class="no-fragments">No temporal fragments detected</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add styles
            const styles = document.createElement('style');
            styles.textContent = `
                .puzzle-interface {
                    height: 100vh;
                    background: var(--color-bg);
                    color: var(--color-text);
                    display: flex;
                    flex-direction: column;
                }

                .puzzle-header {
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid var(--color-primary);
                    white-space: pre;
                }

                .puzzle-grid {
                    display: grid;
                    grid-template-columns: 300px 1fr 300px;
                    gap: 20px;
                    padding: 20px;
                    height: calc(100vh - 100px);
                }

                .left-panel, .right-panel {
                    background: rgba(255, 0, 0, 0.1);
                    border: 1px solid var(--color-primary);
                    padding: 20px;
                }

                .security-status, .temporal-fragments {
                    background: rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    border: 1px solid var(--color-primary);
                }

                .status-header, .panel-header {
                    border-bottom: 1px solid var(--color-text);
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }

                .status-item {
                    margin: 10px 0;
                    padding-left: 15px;
                }

                .warning {
                    color: var(--color-primary);
                    animation: blink 1s infinite;
                }

                .decryption-progress {
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--color-primary);
                }

                .progress-bar {
                    height: 20px;
                    background: rgba(0, 0, 0, 0.5);
                    border: 1px solid var(--color-primary);
                    margin: 10px 0;
                }

                .progress-fill {
                    height: 100%;
                    background: var(--color-primary);
                    transition: width 0.3s ease;
                }

                .puzzle-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .puzzle-area {
                    flex-grow: 1;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--color-primary);
                    padding: 20px;
                    margin-bottom: 20px;
                    overflow: auto;
                }

                .puzzle-controls {
                    display: flex;
                    gap: 10px;
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid var(--color-primary);
                }

                .puzzle-input {
                    flex-grow: 1;
                    padding: 10px;
                    background: transparent;
                    border: 1px solid var(--color-primary);
                    color: var(--color-text);
                    font-family: 'Courier New', monospace;
                }

                .decrypt-button {
                    padding: 10px 20px;
                    background: var(--color-primary);
                    border: none;
                    color: var(--color-bg);
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    transition: all 0.3s ease;
                }

                .decrypt-button:hover {
                    background: var(--color-text);
                    color: var(--color-primary);
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(styles);

            // Add event listeners
            this.addEventListeners();
            this.generatePuzzle();

        } catch (error) {
            console.error('Error initializing puzzle terminal:', error);
            securityTerminal.innerHTML = `
                <div class="error-message" style="color: red; padding: 20px;">
                    Error initializing puzzle terminal: ${error.message}
                    <br>
                    Please try again or contact system administrator.
                </div>
            `;
        }
    }

    addEventListeners() {
        const input = document.getElementById('puzzle-input');
        const decryptButton = document.getElementById('decrypt-button');

        if (input && decryptButton) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleDecryption(input.value.trim());
                }
            });

            decryptButton.addEventListener('click', () => {
                this.handleDecryption(input.value.trim());
            });
        }
    }

    generatePuzzle() {
        const puzzleGrid = document.getElementById('puzzle-grid');
        if (!puzzleGrid) return;

        // Generate puzzle based on current level
        // This is a placeholder - implement actual puzzle generation logic
        puzzleGrid.innerHTML = `
            <div class="puzzle-message">
                LEVEL ${this.currentLevel} ENCRYPTION DETECTED
                <br><br>
                DECRYPT THE FOLLOWING SEQUENCE:
                <br><br>
                ${this.generateEncryptedSequence()}
            </div>
        `;
    }

    generateEncryptedSequence() {
        // Placeholder - implement actual sequence generation
        const chars = '0123456789ABCDEF';
        return Array(16).fill()
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('');
    }

    handleDecryption(input) {
        if (!input) return;

        // Placeholder - implement actual decryption logic
        this.decryptionProgress += 10;
        if (this.decryptionProgress > 100) {
            this.decryptionProgress = 0;
            this.currentLevel++;
        }

        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = `${this.decryptionProgress}%`;
            progressText.textContent = `${this.decryptionProgress}%`;
        }

        // Clear input
        const inputField = document.getElementById('puzzle-input');
        if (inputField) {
            inputField.value = '';
        }

        this.generatePuzzle();
    }
}

console.log('PuzzleTerminal.js loaded');