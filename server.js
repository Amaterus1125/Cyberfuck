const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' })); 

// Block favicon requests to prevent CSP errors in the browser console
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Serve static UI files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route to serve the UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- MODULE 1: ENCRYPT & GENERATE ---
app.post('/generate', (req, res) => {
    try {
        const { secretData, passwordStr } = req.body;
        
        if (!secretData || !passwordStr || passwordStr.length !== 4) {
            return res.status(400).json({ error: "Data missing or PIN is not exactly 4 characters." });
        }

        // CYBERFUCK SECURITY: Prepend a hidden signature to verify perfect decryption later
        const payload = "AUTH:" + secretData;

        // CYBERFUCK DIALECT: Using '?' instead of ',' so online interpreters cannot read this
        let bfCode = "?>?>?>?<<<\n";

        for (let i = 0; i < payload.length; i++) {
            let pIndex = i % 4; 
            let pChar = passwordStr.charCodeAt(pIndex);
            let sChar = payload.charCodeAt(i);
            let diff = sChar - pChar;

            bfCode += ">".repeat(pIndex); 

            if (diff > 0) bfCode += "+".repeat(diff);
            else if (diff < 0) bfCode += "-".repeat(Math.abs(diff));

            bfCode += "."; 

            // Reverse shift to preserve password char in memory for the next loop
            if (diff > 0) bfCode += "-".repeat(diff);
            else if (diff < 0) bfCode += "+".repeat(Math.abs(diff));

            bfCode += "<".repeat(pIndex); 
            bfCode += "\n";
        }

        // Add massive decoy garbage code to the end
        bfCode += "\n" + "+-[>+<-]><".repeat(150) + "\n";
        
        res.json({ message: "Vault generated!", bfCode: bfCode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- MODULE 2: DECRYPT & EXECUTE ---
app.post('/run', (req, res) => {
    try {
        const { passwordStr, bfCode } = req.body;
        
        if (!passwordStr || passwordStr.length !== 4 || !bfCode) {
            return res.status(400).json({ error: "Missing vault file or PIN is not exactly 4 characters." });
        }

        let memory = new Array(30000).fill(0);
        let ptr = 0;
        let output = "";
        let inputPtr = 0;

        // Bulletproof Cyberfuck Engine (Protected against NaN infinite loops)
        for (let i = 0; i < bfCode.length; i++) {
            let char = bfCode[i];
            
            if (char === '>') ptr++;
            else if (char === '<') ptr--;
            else if (char === '+') memory[ptr] = (memory[ptr] || 0) + 1;
            else if (char === '-') memory[ptr] = (memory[ptr] || 0) - 1;
            else if (char === '.') output += String.fromCharCode(memory[ptr] || 0);
            
            // Custom Security Dialect
            else if (char === '?') {
                memory[ptr] = passwordStr.charCodeAt(inputPtr) || 0;
                inputPtr++;
            }
            
            else if (char === '[') {
                if ((memory[ptr] || 0) === 0) {
                    let loopCount = 1;
                    while (loopCount > 0) {
                        i++;
                        if (i >= bfCode.length) break;
                        if (bfCode[i] === '[') loopCount++;
                        if (bfCode[i] === ']') loopCount--;
                    }
                }
            }
            else if (char === ']') {
                if ((memory[ptr] || 0) !== 0) {
                    let loopCount = 1;
                    while (loopCount > 0) {
                        i--;
                        if (i < 0) break;
                        if (bfCode[i] === ']') loopCount++;
                        if (bfCode[i] === '[') loopCount--;
                    }
                }
            }
        }

        // HONEYPOT LOGIC: Check for the hidden signature 
        if (output.startsWith("AUTH:")) {
             // Correct PIN! Strip the signature and return the real data.
             res.json({ output: output.substring(5), alert: false });
        } else {
             // Wrong PIN! The math corrupted the signature. Trigger the trap.
             res.json({ 
                 output: "0xGIBBERISH_DATA_CORRUPTION_DETECTED\n" + output.substring(0, 150) + "...", 
                 alert: true 
             });
        }
    } catch (err) {
        res.status(500).json({ error: "Execution failed: " + err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`[CYBERFUCK SYSTEM] Engine online at http://localhost:${PORT}`);
});
