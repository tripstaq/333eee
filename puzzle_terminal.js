class PuzzleTerminal {
    constructor() {
        this.currentPuzzle = null;
        this.currentLevel = 1;
        
        // Fixed security sequences for each level
        this.securitySequences = {
            1: {
                pattern: [1, 4, 7, 2, 5, 8],
                message: "SECURITY PROTOCOL ALPHA",
                hint: "Sequence follows a vertical pattern..."
            },
            2: {
                pattern: [1, 2, 3, 6, 9, 8, 7, 4],
                message: "SECURITY PROTOCOL BETA",
                hint: "Sequence follows the outer edges..."
            },
            3: {
                pattern: [5, 2, 3, 6, 9, 8, 7, 4, 1],
                message: "SECURITY PROTOCOL GAMMA",
                hint: "Sequence spirals inward..."
            }
        };

        // Track progress
        this.attempts = 0;
        this.maxAttempts = 3;
        this.currentSequence = [];
        this.isLocked = false;
    }

    initializePuzzleTerminal(level) {
        this.currentLevel = level;
        this.attempts = 0;
        this.currentSequence = [];
        this.isLocked = false;
        
        const levelData = this.securitySequences[this.currentLevel];
        
        return {
            message: levelData.message,
            gridSize: 3,
            maxAttempts: this.maxAttempts,
            hint: levelData.hint
        };
    }

    handleInput(number) {
        if (this.isLocked) {
            return {
                status: 'error',
                message: 'Terminal locked. Please reinitialize security protocol.'
            };
        }

        const levelData = this.securitySequences[this.currentLevel];
        const expectedPattern = levelData.pattern;
        
        this.currentSequence.push(number);

        // Check if the sequence matches so far
        for (let i = 0; i < this.currentSequence.length; i++) {
            if (this.currentSequence[i] !== expectedPattern[i]) {
                this.attempts++;
                this.currentSequence = [];
                
                if (this.attempts >= this.maxAttempts) {
                    this.isLocked = true;
                    return {
                        status: 'locked',
                        message: 'Maximum attempts exceeded. Terminal locked.'
                    };
                }

                return {
                    status: 'error',
                    message: `Incorrect sequence. ${this.maxAttempts - this.attempts} attempts remaining.`,
                    remainingAttempts: this.maxAttempts - this.attempts
                };
            }
        }

        // If we've matched the entire sequence
        if (this.currentSequence.length === expectedPattern.length) {
            return {
                status: 'success',
                message: 'Security protocol bypassed successfully.',
                completed: true
            };
        }

        // Correct so far but incomplete
        return {
            status: 'progress',
            message: 'Sequence accepted. Continue pattern.',
            progress: this.currentSequence.length / expectedPattern.length
        };
    }

    getHint() {
        return this.securitySequences[this.currentLevel].hint;
    }

    resetPuzzle() {
        this.currentSequence = [];
        this.attempts = 0;
        this.isLocked = false;
        return {
            status: 'reset',
            message: 'Security protocol reinitialized.'
        };
    }
}

console.log('PuzzleTerminal.js loaded');