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

        // Fixed temporal codes for each level
        this.temporalCodes = {
            1: {
                sequence: ['AA395B41620BC73E'],
                hints: [
                    'First temporal signature detected...',
                    'Pattern matches early timeline distortion',
                    'Try DECRYPT AA395B41620BC73E'
                ]
            },
            2: {
                sequence: ['FF872C90134AD45B', 'CC671D23458EF90A'],
                hints: [
                    'Multiple temporal signatures detected...',
                    'Quantum interference patterns increasing'
                ]
            },
            3: {
                sequence: ['DD789A12345BC67E', 'EE123F45678AD90B', 'BB234E78901CD56F'],
                hints: [
                    'Critical temporal anomalies detected...',
                    'Timeline integrity compromised'
                ]
            }
        };

        // Fixed anomaly sequence
        this.anomalies = {
            1: [{
                id: 'paradox-alpha',
                hint: 'Minor temporal paradox detected in sector 7',
                solution: 'ANALYZE paradox-alpha'
            }],
            2: [{
                id: 'quantum-shift',
                hint: 'Quantum shift detected in temporal matrix',
                solution: 'ANALYZE quantum-shift'
            }],
            3: [{
                id: 'entropy-cascade',
                hint: 'Critical entropy cascade forming',
                solution: 'ANALYZE entropy-cascade'
            }]
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
                            <div class="chat-messages" id="chat-messages">
                                <div class="message system">
                                    TEMPORAL AI INTERFACE INITIALIZED...
                                </div>
                                <div class="message ai">
                                    Greetings. I am the Temporal AI assigned to assist with data recovery and temporal anomaly analysis. How may I help you?
                                </div>
                            </div>
                            <div class="chat-input-container">
                                <span class="prompt">>></span>
                                <input type="text" id="message-input" class="chat-input" 
                                    placeholder="Enter command..." autocomplete="off">
                            </div>
                        </div>

                        <div class="right-panel">
                            <div class="data-display">
                                <div class="panel-header">RECOVERED DATA</div>
                                <div class="data-list" id="data-fragments">
                                    ${this.renderDataFragments()}
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
        messages.innerHTML += `
            <div class="message user">${this.escapeHtml(message)}</div>
            <div class="message ai">Processing your request...</div>
        `;
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
        `;
        document.head.appendChild(styles);
    }

    handleScanCommand() {
        const currentLevelData = this.temporalCodes[this.currentLevel];
        const currentAnomalies = this.anomalies[this.currentLevel];
        
        // Check if all codes for this level have been discovered
        const unsolvedCodes = currentLevelData.sequence.filter(
            code => !this.gameState.decryptedCodes.has(code)
        );

        // Check if all anomalies for this level have been resolved
        const unsolvedAnomalies = currentAnomalies.filter(
            anomaly => !this.gameState.discoveredAnomalies.has(anomaly.id)
        );

        if (unsolvedCodes.length > 0) {
            const nextCode = unsolvedCodes[0];
            return `SCAN COMPLETE: Detected encrypted temporal signature: ${nextCode}\nUse DECRYPT command to process this code.`;
        }

        if (unsolvedAnomalies.length > 0) {
            const nextAnomaly = unsolvedAnomalies[0];
            this.gameState.currentPuzzle = nextAnomaly.id;
            return `ALERT: ${nextAnomaly.hint}\nUse ANALYZE command to examine the anomaly.`;
        }

        return "SCAN COMPLETE: No new temporal signatures detected in this sector.";
    }

    handleDecryptCommand(code) {
        if (!code) {
            return "ERROR: Please provide a code to decrypt.";
        }

        const currentLevelCodes = this.temporalCodes[this.currentLevel].sequence;
        
        if (currentLevelCodes.includes(code) && !this.gameState.decryptedCodes.has(code)) {
            this.gameState.decryptedCodes.add(code);
            const fragmentId = `TEMPORAL_FRAGMENT_${code.substring(0, 8)}`;
            this.gameState.temporalFragments.set(fragmentId, {
                id: fragmentId,
                content: `Decrypted temporal data from code ${code}`,
                timestamp: new Date().toISOString()
            });

            return `DECRYPTION SUCCESSFUL: New temporal fragment recovered.\nProgress: ${this.gameState.decryptedCodes.size}/${currentLevelCodes.length} codes decrypted.`;
        }

        return "DECRYPTION FAILED: Invalid or already processed code.";
    }

    getHint() {
        if (this.gameState.hints <= 0) {
            return "ERROR: No hints remaining. Continue scanning for temporal signatures.";
        }

        const currentLevelData = this.temporalCodes[this.currentLevel];
        const unsolvedCodes = currentLevelData.sequence.filter(
            code => !this.gameState.decryptedCodes.has(code)
        );

        this.gameState.hints--;
        
        if (unsolvedCodes.length > 0) {
            const hintIndex = currentLevelData.sequence.length - unsolvedCodes.length;
            return `HINT (${this.gameState.hints} remaining):\n${currentLevelData.hints[hintIndex] || 'Use SCAN to detect temporal signatures.'}`;
        }

        return `HINT (${this.gameState.hints} remaining):\nAll codes for this level have been decrypted. Check for remaining anomalies.`;
    }
}

console.log('ChatInterface.js loaded');