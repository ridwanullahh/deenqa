# AGENTS.md

## Commands

- **Setup**: `pnpm install` (uses pnpm, see pnpm-lock.yaml)
- **Build**: `pnpm run build`
- **Lint**: `pnpm run lint`
- **Test**: No test framework configured
- **Dev Server**: `pnpm run dev` (starts Next.js dev server on http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **UI**: React 19, Radix UI components, Tailwind CSS, Framer Motion
- **Styling**: Tailwind CSS with custom theme, shadcn/ui component library
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Fonts**: Geist font family

## Architecture

- App Router structure: `/app` directory with route-based pages (e.g., `/app/page.tsx`, `/app/topic/page.tsx`)
- Reusable components in `/components` (UI components in `/components/ui`)
- Shared utilities in `/lib`, data in `/data`, custom hooks in `/hooks`
- Path alias: `@/*` maps to repo root
- Client-side rendering for interactivity (most components use `"use client"`)

## Code Style

- Use `cn()` utility from `@/lib/utils` for conditional className merging
- Prefer functional components with TypeScript interfaces for props
- Use forwardRef for components that need ref access
- Follow existing component patterns (see `/components/ui` for reference)
- Component variants with `cva()` from `class-variance-authority`
- Theme-aware styling with `next-themes` and conditional dark/light classes
- No comments in code (as per v0.dev conventions)
