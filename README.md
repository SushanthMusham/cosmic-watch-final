# 🌌 Cosmic Watch: AI-Powered Planetary Defense System

**Cosmic Watch** is a real-time Near-Earth Object (NEO) tracker that combines NASA telemetry with Google Gemini AI to provide military-grade risk assessments of approaching asteroids.

**Live Link: **https://cosmic-watch-final-3jwu.vercel.app/login.

**Demo Video: **https://drive.google.com/file/d/1gMT6I1YN2uLLLcQXp9F77Mbqq_FgMFbs/view?usp=sharing

**Presentation pdf: ** [Cosmic_Watch.pdf](https://github.com/user-attachments/files/25157721/Cosmic_Watch.pdf)


## 🚀 Key Features
- **3D Orbital Engine:** Interactive visualization of Earth and asteroid swarms using Three.js.
- **Live NASA Feed:** Real-time data processing from the NeoWs API.
- **Gemini AI Analyst:** A "Jarvis-like" agent that analyzes physical data (size, velocity, miss distance) to generate human-readable threat reports.
- **Resilient Architecture:** Includes a "Simulation Mode" fallback to ensure the demo never crashes during API rate limits.
- **Dockerized:** One-command deployment via Docker Compose.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Three.js (Fiber)
- **Backend:** Node.js, Express, TypeScript, MongoDB
- **AI:** Google Gemini 2.5 Flash
- **DevOps:** Docker, Docker Compose

## 🛡️ Security & Architecture
- **Separation of Concerns:** Frontend and Backend are decoupled and containerized separately.
- **Environment Security:** API Keys (NASA, Gemini) are managed via `.env` files and never exposed to the client.
- **Rate Limiting:** Backend implements smart caching and "Simulation Mode" to prevent API abuse.

## ⚡ Quick Start (Docker)
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/cosmic-watch.git](https://github.com/YOUR_USERNAME/cosmic-watch.git)
   cd cosmic-watch
   ```
2.**Configure Environment: Create a .env file in the root directory and add your keys:**
   ```bash
    NASA_API_KEY=your_key
    GEMINI_API_KEY=your_key
    MONGO_URI=mongodb://mongo:27017/cosmic-watch
   ```
3. **Run the Application:**
   ```bash
   docker-compose up --build
   ```
4. **Access the Dashboard: Open http://localhost:3000 to view the live tracker.**

## 📡 API Documentation
A full Postman collection (cosmic_watch.postman_collection.json) and a readable PDF guide (API_Documentation.pdf) are included in the root directory for testing all endpoints.

## 🤖 AI Usage
Per hackathon rules, an AI-LOG.md file is included detailing how LLMs were used to assist in development (debugging, boilerplate generation).

---

### 📝 2. The `AI-LOG.md` (Required by Rules)
**Do not forget this file.** The rules stated: *"Teams must submit an AI-LOG.md detailing how LLMs were used."*

Create a file named **`AI-LOG.md`** in your root folder and paste this:

```markdown
# 🤖 AI Usage Log

In compliance with the hackathon guidelines, this document details how Large Language Models (LLMs) were utilized to assist in the development of **Cosmic Watch**.

## 1. Conceptualization & Architecture
- **Role:** Brainstorming Partner
- **Usage:** Used AI to discuss the feasibility of integrating NASA NeoWs API with Google Gemini.
- **Outcome:** Refined the "Risk Analysis" engine logic to combine hard data (NASA) with qualitative analysis (Gemini).

## 2. Debugging & Error Resolution
- **Role:** Pair Programmer
- **Usage:**
    - Diagnosed a critical `undefined` crash in the frontend caused by inconsistent variable naming (`camelCase` vs `snake_case`) from the API.
    - Resolved `404 Not Found` and `429 Too Many Requests` errors with the Google Generative AI SDK by implementing a fallback "Simulation Mode."
    - Debugged Docker build failures related to Node.js version mismatches (Node 18 vs Node 20).

## 3. Data Formatting & Boilerplate
- **Role:** Code Scaffolding
- **Usage:**
    - Generated TypeScript interfaces to match the complex nested JSON structure of NASA's API responses.
    - Created the initial `Dockerfile` and `docker-compose.yml` configurations for multi-stage builds.
    - Assisted in writing the Postman collection documentation structure.

## 4. Prompt Engineering
- **Role:** Content Generation
- **Usage:** Designed and refined the "System Instructions" for the Gemini Agent to ensure it responds with a strict, military-style "Jarvis" persona rather than generic text.

---
*Note: All core logic, business rules, and UI/UX decisions were verified and implemented by the us.*
