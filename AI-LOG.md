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