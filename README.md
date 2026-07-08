
#  CyberFuck: The Honeypot Vault

**CyberFuck** is an active-defense cybersecurity tool that weaponizes esoteric programming to protect sensitive data. It doesn't just store secrets; it traps intruders.

---

##  The Concept
Standard encryption is passive—it just sits there. **CyberFuck** is active. We leverage a custom-built, high-security Brainfuck dialect to transform plain text and images into encrypted vaults. 

If an unauthorized user attempts to decrypt the data with the wrong 4-digit PIN, the system triggers a **Honeypot Alert**, instantly logging the breach attempt and neutralizing the output.

## Features
* **Esoteric Encryption:** Uses a custom Brainfuck dialect for non-standard data obfuscation.
* **Honeypot Trap:** Real-time detection of brute-force attempts via hidden signature verification.
* **Glassmorphism UI:** AAA-tier, retro-futuristic synthwave interface for a professional hacker aesthetic.
* **Full-Stack Security:** Node.js backend with custom-built interpreter logic.

## 💻 Tech Stack
* **Frontend:** HTML5, CSS3 (Glassmorphism), Vanilla JavaScript.
* **Backend:** Node.js, Express.js, Serverless-ready architecture.
* **DevOps:** Render (Deployment), Git/GitHub (Version Control).
* **Security Logic:** Custom Esoteric Interpreter & Mathematical Offset Algorithms.

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Amaterus1125/Cyberfuck.git](https://github.com/Amaterus1125/Cyberfuck.git)
   cd Cyberfuck

```

2. **Install dependencies:**
```bash
npm install

```


3. **Run locally:**
```bash
node server.js

```



##  Usage

1. **Encrypt:** Enter sensitive data or upload an image, set a 4-character PIN, and download your `.bf` vault file.
2. **Decrypt:** Upload your `.bf` file and enter your 4-character PIN.
* **Correct PIN:** Data is decrypted and displayed.
* **Incorrect PIN:** The system triggers the Honeypot logic, preventing data recovery and alerting of an intrusion.



## 🛡️ Hackathon Goals

This project was built to demonstrate how unconventional programming languages can be repurposed for modern security tasks. We focused on the intersection of **UX/UI aesthetics** and **hardcore backend logic** to create a tool that is as functional as it is visually arresting.

## License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
