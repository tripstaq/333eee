// Add puzzle definitions
const puzzles = {
  1: {
    question: "What is 2+2?",
    answer: "4",
    hint: "Basic arithmetic",
    points: 100
  },
  // Add more puzzles up to 1000
  1000: {
    question: "Final challenge",
    answer: "ultimate_solution",
    hint: "Look deep within",
    points: 10000
  }
};

// Add a broadcast function to notify all clients
function broadcastToAll(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Modify the /chat endpoint to include puzzle information
app.post('/chat', async (req, res) => {
  const { message, level } = req.body;
  
  try {
    const currentPuzzle = puzzles[level];
    db.get('SELECT revealed_info FROM game_state', async (err, row) => {
      const revealedInfo = JSON.parse(row.revealed_info);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI game master. Current puzzle: ${currentPuzzle.question}. 
                     You can provide hints but never reveal the answer directly.
                     Available information: ${revealedInfo.join('. ')}`
          },
          { role: "user", content: message }
        ]
      });

      // ... existing code ...
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify updateLevel endpoint
app.post('/updateLevel', (req, res) => {
  const { level, solver, answer } = req.body;
  
  db.get('SELECT current_level FROM game_state', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const currentPuzzle = puzzles[row.current_level];
    if (answer !== currentPuzzle.answer) {
      return res.status(400).json({ error: 'Incorrect solution' });
    }
    
    // Update game state for all players
    db.run('UPDATE game_state SET current_level = ?', [level], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Record the solver
      db.run('INSERT INTO solutions (level, solver) VALUES (?, ?)', [level-1, solver]);
      
      // Broadcast level completion to all connected clients
      broadcastToAll({
        type: 'level_complete',
        level,
        solver,
        message: `${solver} has solved level ${level-1}! Everyone advances to level ${level}.`
      });
      
      res.json({ 
        success: true, 
        newLevel: level,
        message: `Level ${level-1} completed! All players advanced to level ${level}.`
      });
    });
  });
}); 