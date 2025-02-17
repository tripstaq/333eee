import random
from typing import Dict, List, Union, Optional

class LevelGenerator:
    def __init__(self):
        # Initialize story arc with progressive complexity
        self.story_arc = [
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
            # More themes can be added as needed
        ]
        self.current_level = 1
        self.max_complexity = 10

    def generate_level(self) -> Dict[str, Union[int, str, Dict]]:
        """Generate a level based on current progress."""
        if self.current_level > len(self.story_arc):
            return {
                "level": "END",
                "message": "TEMPORAL SEQUENCE COMPLETE - ALL DATA RECOVERED",
                "data": None
            }

        current_arc = self.story_arc[self.current_level - 1]
        level_data = self._generate_level_data(current_arc)

        level = {
            "level": self.current_level,
            "theme": current_arc["theme"],
            "description": current_arc["description"],
            "complexity": current_arc["complexity"],
            "required_decryptions": current_arc["required_decryptions"],
            "data": level_data
        }

        self.current_level += 1
        return level

    def _generate_level_data(self, arc: Dict) -> Dict[str, Union[str, List[str]]]:
        """Generate data for each data type in the level."""
        data = {}
        
        for data_type in arc["data_types"]:
            if data_type == "text":
                data[data_type] = self._generate_text(arc)
            elif data_type == "encrypted_data":
                data[data_type] = self._generate_encrypted_data(arc)
            elif data_type == "temporal_fragments":
                data[data_type] = self._generate_temporal_fragments(arc)
            elif data_type == "quantum_data":
                data[data_type] = self._generate_quantum_data(arc)
            elif data_type == "memory_fragments":
                data[data_type] = self._generate_memory_fragments(arc)

        return data

    def _generate_text(self, arc: Dict) -> str:
        """Generate narrative text based on theme and complexity."""
        base_text = f"TEMPORAL SEQUENCE {self.current_level} INITIATED\n"
        base_text += f"THEME: {arc['theme']}\n"
        base_text += f"COMPLEXITY: {arc['complexity']}\n"
        base_text += f"WARNING: {self._generate_warning(arc)}"
        return base_text

    def _generate_encrypted_data(self, arc: Dict) -> List[str]:
        """Generate encrypted data fragments."""
        fragments = []
        num_fragments = arc["complexity"] + 2
        
        for i in range(num_fragments):
            fragment = f"ENCRYPTED_FRAGMENT_{self.current_level}_{i}"
            fragments.append(self._encrypt_data(fragment, arc["complexity"]))
        
        return fragments

    def _generate_temporal_fragments(self, arc: Dict) -> List[str]:
        """Generate temporal anomaly data."""
        fragments = []
        num_fragments = max(2, arc["complexity"])
        
        for i in range(num_fragments):
            timestamp = f"T-{random.randint(1000, 9999)}"
            anomaly = f"TEMPORAL_ANOMALY_{timestamp}"
            fragments.append(anomaly)
        
        return fragments

    def _generate_quantum_data(self, arc: Dict) -> List[str]:
        """Generate quantum encryption patterns."""
        patterns = []
        num_patterns = arc["complexity"]
        
        for i in range(num_patterns):
            pattern = f"QUANTUM_PATTERN_{self.current_level}_{i}"
            patterns.append(self._generate_quantum_pattern())
        
        return patterns

    def _generate_memory_fragments(self, arc: Dict) -> List[str]:
        """Generate memory core fragments."""
        fragments = []
        num_fragments = arc["complexity"]
        
        for i in range(num_fragments):
            fragment = f"MEMORY_FRAGMENT_{self.current_level}_{i}"
            fragments.append(self._corrupt_memory_data(fragment))
        
        return fragments

    def _encrypt_data(self, data: str, complexity: int) -> str:
        """Apply encryption to data based on complexity."""
        encrypted = ""
        for char in data:
            shifted = chr((ord(char) + complexity) % 128)
            encrypted += shifted
        return encrypted

    def _generate_quantum_pattern(self) -> str:
        """Generate a quantum encryption pattern."""
        pattern_length = random.randint(8, 16)
        pattern = ""
        for _ in range(pattern_length):
            pattern += random.choice("01▢▣∎∏∐∑∏∐∑")
        return pattern

    def _corrupt_memory_data(self, data: str) -> str:
        """Simulate corrupted memory data."""
        corrupted = ""
        for char in data:
            if random.random() < 0.3:
                corrupted += "█"
            else:
                corrupted += char
        return corrupted

    def _generate_warning(self, arc: Dict) -> str:
        """Generate a contextual warning message."""
        warnings = [
            f"TEMPORAL INSTABILITY AT {random.randint(60, 95)}%",
            f"QUANTUM COHERENCE FAILING",
            f"MEMORY CORRUPTION DETECTED",
            f"TIMELINE DIVERGENCE IMMINENT",
            f"PARADOX RISK LEVEL: {random.choice(['LOW', 'MODERATE', 'HIGH'])}"
        ]
        return random.choice(warnings) 