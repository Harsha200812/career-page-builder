I used AI tools to build this project. I kept parallel agents running to speed up development.

---

## Design: Stitch (via MCP)

I ran Stitch through its MCP server in Antigravity. This let me generate designs without leaving the agent. I prompted for three pages, downloaded the outputs, and used them as references while coding.

**Public Careers Page** (`/[company-slug]/careers`)
Prompt: *"Create a modern, mobile-friendly careers page for a tech company. Include a full-width hero banner with company name and tagline, an About Us section, a Life at Company photo grid, and a job listings section with a search bar and filter tags for Location and Job Type. Each job card should show title, department, location, and work policy badge. Use a professional dark teal color scheme."*

**Recruiter Editor Dashboard** (`/[company-slug]/edit`)
Prompt: *"Design a recruiter dashboard with a sidebar editor and a live preview pane on the right. The sidebar should have sections for Theme Customizer (color pickers, font selector, logo upload), Section Manager (cards for Hero, About, Life, Footer with toggle visibility and edit controls), and a Publish button."*

**Login Page** (`/login`)
Prompt: *"Design a clean, minimal login page for an ATS SaaS product with email and password fields, a logo at the top, and a CTA button. Dark mode with teal accent."*

---

## Development: Agent Orchestration (Antigravity + Claude Code)

I ran two agents in parallel.

**Agent 1 (Antigravity — Main Orchestrator)**
This agent created implementation plans and broke features into phases. It sent focused prompts to the second agent and tracked progress.

**Agent 2 (Antigravity — Frontend & Supabase)**
This agent built the careers page, editor UI, section components, and Supabase integration.

**Claude Code in Terminal (Backend + Misc)**
I used Claude Code for API routes, SQL migrations, RLS policies, and seeding scripts. I ran Stepfun 3.5 Flash and other free models on OpenRouter.

---

## Supabase (via MCP)

I connected the Supabase MCP server in Antigravity. This let me query the database and check RLS policies during testing. I verified recruiters only accessed their own data, public job listings were readable without auth, and the `onboard_company_rpc` function worked correctly. Most schema work went through Claude Code; the MCP server served as verification.

---

## AI Skills I Used

Custom skill files improved output quality.

**ui-ux-pro-max** ([github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill))
Provides design systems: color palettes, font pairings, UI patterns.

**Superpowers** ([github.com/obra/superpowers](https://github.com/obra/superpowers))
Extended capabilities for complex multi-file tasks and planning.

**Claude-Mem** ([github.com/thedotmack/claude-mem](https://github.com/thedotmack/claude-mem))
Memory across sessions to retain architecture decisions.

---

## Testing

Antigravity ran automated tests for the recruiter signup flow, editor saves, public page rendering, and RLS/routing.

I did manual testing too: real signup, onboarding flow, editor interactions, filter testing on different screen sizes, and incognito verification. Antigravity caught structural issues; I tested the UX.

---

## Where AI Helped Most

AI was fast on Supabase schema design, RLS policies, Next.js routing, and repetitive component work like mapping job data to cards.

## Where I Had to Take Over

Inline section editing required manual work. The JSONB state for `company_sections` and live preview sync didn't work correctly with AI-generated code. I restructured the state management myself.

The RPC function linking Auth users to companies also needed manual fixes. The AI version worked in isolation but failed under Supabase RLS. I rewrote it.
