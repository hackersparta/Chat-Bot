---
name: chatbot-dev-skill
description: Comprehensive guide for developing, maintaining, and deploying the Hybrid Conversational Commerce Chatbot. Use this skill when working on the chatbot codebase, adding new features, debugging the router logic, or managing the deployment.
---

# Chatbot Development Skill

This skill governs the development of the Conversational Commerce Chatbot, a high-performance system using a hybrid Hybrid (Rule-based + LLM) architecture.

## Architecture Guidelines

The system is built on **Node.js + Fastify** for maximum performance.

### The "Traffic Cop" Pattern

All incoming messages must pass through the `MessageRouter` (The Traffic Cop):

1.  **Cache Layer (Redis/Memory)**: Check if the user is in an active state (e.g., waiting for location input).
2.  **Rule Engine (The Fast Lane)**: Check for deterministic matches using Regex/Keywords.
    *   *Cost*: $0, Latency: <10ms.
    *   *Use Cases*: Menu, Price, Location, Catalog requests.
3.  **LLM Service (The Slow Lane)**: Fallback for complex queries.
    *   *Usage*: Only if no rule matches.
    *   *Model*: Google Gemini 1.5 Flash (via API).

### Development Standards

*   **Language**: TypeScript (Strict mode).
*   **Formatting**: Prettier + ESLint.
*   **Database**: Supabase (PostgreSQL). Use `supabase-js` client.
*   **Docker**: All local development must be done via `docker compose up`.

## Workflow

### 1. Adding a New "Hardcoded" Flow
*   Update `src/rules/definitions.ts` (or equivalent) to add the new Regex pattern.
*   Implement the handler in `src/handlers/`.
*   **Test**: Verify it DOES NOT trigger the LLM.

### 2. Updating Product Data
*   The bot fetches products from Supabase.
*   Do NOT hardcode product details in JSON files unless it's a fallback configuration.

### 3. Debugging Voice
*   Voice notes are processed by `src/services/VoiceService.ts`.
*   Uses `faster-whisper` (local) or OpenAI Whisper API.

## References

*   **Implementation Plan**: [implementation_plan.md](references/implementation_plan.md) - The master technical design doc.
*   **Database Schema**: [schema.md](references/schema.md) - DB tables and relationships.
