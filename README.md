# Recruiting Agent

Mastra AI Agent with two specialized agents: recruiting and interview.

## Features

- Recruiting AI agent for finding React developers from Ukraine
- Interview agent: 3 questions about React/TypeScript + final report with scoring
- Local state persistence with SQLite/LibSQL

## Tech Stack

- Node.js >= 22.13.0
- TypeScript
- Mastra
- LibSQL
- Tavily
- Zod

## Installation

```bash
pnpm install
```

## Environment Variables

Create a `.env` file in the `mastra` folder:

```env
MISTRAL_API_KEY=...
TAVILY_API_KEY=...
```

## Running

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

## Project Structure

```
mastra/
  src/mastra/
    agents/
      recruiting-agent.ts
      interview-agent.ts
    index.ts
  .mastra/
  mastra.db
```

## Agents

| Agent | Purpose |
| --- | --- |
| recruitingAgent | Candidate search via Tavily and web fetch |
| interviewAgent | Interview conduction and report generation |

## License

Apache-2.0
