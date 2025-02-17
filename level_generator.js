class LevelGenerator {
    constructor() {
        this.currentLevel = 1;
        this.story_arc = [
            {
                "theme": "System Breach",
                "complexity": 1,
                "data_types": ["text"],
                "description": "Initial breach into the temporal system",
                "keywords": ["access", "breach", "system", "temporal", "init"],
                "required_decryptions": 1
            },
            {
                "theme": "Data Recovery",
                "complexity": 2,
                "data_types": ["text", "encrypted_data"],
                "description": "First corrupted data fragments discovered",
                "keywords": ["corrupt", "data", "fragment", "recover", "memory"],
                "required_decryptions": 2
            },
            {
                "theme": "Timeline Anomalies",
                "complexity": 3,
                "data_types": ["text", "encrypted_data", "temporal_fragments"],
                "description": "Detection of temporal inconsistencies",
                "keywords": ["timeline", "anomaly", "paradox", "shift", "temporal"],
                "required_decryptions": 3
            },
            {
                "theme": "Quantum Encryption",
                "complexity": 4,
                "data_types": ["text", "encrypted_data", "temporal_fragments", "quantum_data"],
                "description": "Advanced encryption protocols encountered",
                "keywords": ["quantum", "encrypt", "protocol", "secure", "cipher"],
                "required_decryptions": 3
            },
            {
                "theme": "Memory Core",
                "complexity": 5,
                "data_types": ["text", "encrypted_data", "temporal_fragments", "quantum_data", "memory_fragments"],
                "description": "Access to the central memory core",
                "keywords": ["core", "memory", "central", "access", "neural"],
                "required_decryptions": 4
            }
        ];
    }

    generate_level() {
        if (this.currentLevel > this.story_arc.length) {
            return {
                "level": "END",
                "message": "TEMPORAL SEQUENCE COMPLETE - ALL DATA RECOVERED",
                "data": null
            };
        }

        const current_arc = this.story_arc[this.currentLevel - 1];
        const level_data = this._generate_level_data(current_arc);

        const level = {
            "level": this.currentLevel,
            "theme": current_arc.theme,
            "description": current_arc.description,
            "complexity": current_arc.complexity,
            "required_decryptions": current_arc.required_decryptions,
            "data": level_data
        };

        this.currentLevel++;
        return level;
    }

    _generate_level_data(arc) {
        const data = {};
        
        for (const data_type of arc.data_types) {
            switch(data_type) {
                case "text":
                    data[data_type] = this._generate_text(arc.complexity);
                    break;
                case "encrypted_data":
                    data[data_type] = this._generate_encrypted_data(arc);
                    break;
                case "temporal_fragments":
                    data[data_type] = this._generate_temporal_fragments(arc);
                    break;
                case "quantum_data":
                    data[data_type] = this._generate_quantum_data(arc);
                    break;
                case "memory_fragments":
                    data[data_type] = this._generate_memory_fragments(arc);
                    break;
            }
        }
        
        return data;
    }

    _generate_text(complexity) {
        const words = ['temporal', 'data', 'quantum', 'breach', 'system', 'memory', 'core', 'access'];
        const length = 10 + complexity * 5;
        return Array(length).fill().map(() => 
            words[Math.floor(Math.random() * words.length)]
        ).join(' ');
    }

    _generate_encrypted_data(arc) {
        const fragments = [];
        const num_fragments = arc.complexity + 2;
        
        for (let i = 0; i < num_fragments; i++) {
            const fragment = `ENCRYPTED_FRAGMENT_${this.currentLevel}_${i}`;
            fragments.push(this._encrypt_data(fragment, arc.complexity));
        }
        
        return fragments;
    }

    _generate_temporal_fragments(arc) {
        const fragments = [];
        const num_fragments = Math.max(2, arc.complexity);
        
        for (let i = 0; i < num_fragments; i++) {
            const timestamp = `T-${Math.floor(Math.random() * 9000 + 1000)}`;
            const anomaly = `TEMPORAL_ANOMALY_${timestamp}`;
            fragments.push(anomaly);
        }
        
        return fragments;
    }

    _generate_quantum_data(arc) {
        const patterns = [];
        const num_patterns = arc.complexity;
        
        for (let i = 0; i < num_patterns; i++) {
            patterns.push(this._generate_quantum_pattern());
        }
        
        return patterns;
    }

    _generate_memory_fragments(arc) {
        const fragments = [];
        const num_fragments = arc.complexity;
        
        for (let i = 0; i < num_fragments; i++) {
            const fragment = `MEMORY_FRAGMENT_${this.currentLevel}_${i}`;
            fragments.push(this._corrupt_memory_data(fragment));
        }
        
        return fragments;
    }

    _encrypt_data(data, complexity) {
        return data.split('').map(char => 
            String.fromCharCode((char.charCodeAt(0) + complexity) % 128)
        ).join('');
    }

    _generate_quantum_pattern() {
        const pattern_length = Math.floor(Math.random() * 9 + 8); // 8-16
        const quantum_chars = "01▢▣∎∏∐∑∏∐∑";
        return Array(pattern_length).fill().map(() =>
            quantum_chars[Math.floor(Math.random() * quantum_chars.length)]
        ).join('');
    }

    _corrupt_memory_data(data) {
        return data.split('').map(char =>
            Math.random() < 0.3 ? '█' : char
        ).join('');
    }
}

console.log('LevelGenerator.js loaded'); 