# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Dev server with Turbopack (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest with jsdom
npm run setup        # Full init: install deps, generate Prisma, run migrations
npm run db:reset     # Force reset Prisma migrations
```

## Architecture Overview

UIGen is an AI-powered React component generator with live preview. Key design decisions:

- **Virtual File System**: All generated code lives in memory (`src/lib/file-system.ts`), never written to disk. The `VirtualFileSystem` class manages an in-memory tree, serializable to JSON for DB persistence.

- **AI Integration**: Uses Vercel AI SDK with Claude via `/api/chat`. Two tools are defined:
  - `str_replace_editor` - Edit files with find/replace
  - `file_manager` - Create, delete, view files

  Falls back to `MockLanguageModel` when `ANTHROPIC_API_KEY` is not set.

- **Preview System**: iframe-based preview using Babel standalone for client-side JSX transpilation (`src/lib/transform/`). Entry point detection looks for `/App.jsx` or `/App.tsx`.

- **State Management**: React Context only (no Redux). `FileSystemProvider` and `ChatProvider` in `src/lib/contexts/`.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/chat/route.ts` | AI generation endpoint, tool definitions, project persistence |
| `src/lib/file-system.ts` | VirtualFileSystem class with all file operations |
| `src/lib/provider.ts` | Claude model selection, mock fallback |
| `src/components/preview/PreviewFrame.tsx` | iframe rendering, entry point detection |
| `src/app/main-content.tsx` | Resizable 3-panel layout (chat \| preview \| code) |

## Data Model

SQLite via Prisma. Two tables:
- **User**: email, hashed password, projects relation
- **Project**: name, userId (nullable for anon), messages (JSON string), data (JSON string of virtual FS)

## Environment Variables

- `ANTHROPIC_API_KEY` - Optional; enables Claude, otherwise mock provider
- `JWT_SECRET` - For auth sessions (defaults to dev key)

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- Tailwind CSS v4
- shadcn/ui components
- Monaco Editor
- Prisma with SQLite
