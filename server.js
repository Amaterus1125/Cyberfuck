const express = require('express');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));
app.disable('x-powered-by');


//  SECURITY HEADERS & CSP

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"],
            mediaSrc: ["'self'"] // Allows your background.mp4 to load
        },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' }
}));

// Bumped limit to 10mb so you can encrypt larger images for the demo
app.use(express.json({ limit: '200mb' }));
// Also add this right below it so URL-encoded payloads are extended too:
app.use(express.urlencoded({ limit: '200mb', extended: true }));


//  TARPIT RATE LIMITER

const honeypotLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "0xGIBBERISH_DATA_CORRUPTION_DETECTED: IP BLOCKED" },
    standardHeaders: true,
    legacyHeaders: false,
});

// CRYPTO CORE (AES-256-GCM)

const SALT = "CYBERFUCK_MASTER_SALT_2026"; 

function deriveKey(pin) {
    return crypto.pbkdf2Sync(pin, SALT, 100000, 32, 'sha256');
}

function encryptAES(text, pin) {
    const key = deriveKey(pin);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decryptAES(payload, pin) {
    const parts = payload.split(':');
    if (parts.length !== 3) throw new Error("Malformed Payload");

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = deriveKey(pin);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


// ESOTERIC ENGINE (Brainfuck Dialect)

function encodeBF(hexString, pin) {
    let bfCode = "";
    let pIndex = 0;
    for (let i = 0; i < hexString.length; i++) {
        let sChar = hexString.charCodeAt(i);
        let pChar = pin.charCodeAt(pIndex % pin.length);
        let diff = sChar - pChar;
        
        if (diff > 0) bfCode += "+".repeat(diff) + "?";
        else if (diff < 0) bfCode += "-".repeat(Math.abs(diff)) + "?";
        else bfCode += "?";
        
        pIndex++;
    }
    return bfCode;
}

function decodeBF(bfString, pin) {
    let hexString = "";
    let pIndex = 0;
    let parts = bfString.split("?");
    parts.pop(); 
    
    for (let part of parts) {
        let pChar = pin.charCodeAt(pIndex % pin.length);
        let diff = (part.match(/\+/g) || []).length - (part.match(/\-/g) || []).length;
        hexString += String.fromCharCode(pChar + diff);
        pIndex++;
    }
    return hexString;
}


// ROUTES

app.post('/api/encrypt', (req, res) => {
    try {
        const { text, pin } = req.body;

        if (!text || typeof text !== 'string' || text.length === 0) {
            return res.status(400).json({ error: "Invalid text input." });
        }
        if (!pin || typeof pin !== 'string' || pin.length !== 8) {
            return res.status(400).json({ error: "PIN must be exactly 8 characters." });
        }

        const aesPayload = encryptAES(text, pin);
        const vaultData = encodeBF(aesPayload, pin);

        res.json({ vault: vaultData });

    } catch (err) {
        console.error("[ENCRYPT ERROR]", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/api/decrypt', honeypotLimiter, (req, res) => {
    try {
        const { vault, pin } = req.body;

        if (!vault || typeof vault !== 'string' || vault.length < 10) {
            return res.status(400).json({ error: "Invalid vault data." });
        }
        if (!pin || typeof pin !== 'string' || pin.length !== 8) {
            return res.status(400).json({ error: "PIN must be exactly 8 characters." });
        }

        const aesPayload = decodeBF(vault, pin);
        const decryptedText = decryptAES(aesPayload, pin);

        res.json({ data: decryptedText });

    } catch (err) {
        console.error("[HONEYPOT TRIGGERED]", err.message);
        res.status(401).json({ 
            error: "CRITICAL ERROR: Engine overheated due to low-IQ input. Go back to standard Base64, script kiddie.",
            alert: true
        });
    }
});


// SERVER STARTUP

app.listen(PORT, () => {
    console.log(`\n[CYBERFUCK SYSTEM] Engine online on port ${PORT}`);
    console.log(`➜  Local Dashboard: http://localhost:${PORT}\n`);
});
