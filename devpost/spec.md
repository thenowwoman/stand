---
doc: spec
status: approved
---

# Stand — Technical Spec

## How This Works, In Plain Language
Stand is a mobile-first web app with one main flow: the user types a short description of what they already do, and the app turns it into a professional profile they can send to clients. The app does not need a login, a database, or a full marketplace. It keeps the whole experience lightweight and usable on a phone, with the same flow also working on a laptop for a demo video.

The key idea is a simple AI-assisted transformation: a short job description in plain English becomes a list of skills, then service offers, then a one-page profile, then opportunity suggestions. We keep the data in the browser for the demo so the flow is fast and there is no setup burden. The AI step is handled by a small server-side function or API route so the user never sees or manages a key.

This shape is chosen because it proves the product idea quickly without adding accounts, payments, or database complexity. It is still a real app, not a mockup: the live flow transforms user input into something tangible and shareable.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. The user opens the app and sees a welcome screen with one prompt and sample text ideas.
2. They type a short description of their skills or business help, or choose “Not sure what to write? Ask me questions.”
3. If the input is short or vague, the frontend sends the original description and any earlier answers to the follow-up endpoint.
4. The endpoint calls the model for one concise, warm question at a time. The user answers in a separate field; the app asks two questions and may ask a third if useful.
5. The frontend combines the original description and answers and sends them to the profile endpoint. If follow-up generation fails, the client skips the questions and uses the existing keyword-based fallback.
6. The profile endpoint returns likely skills, service offerings, and a professional bio.
7. The frontend receives structured output and shows cards for the person’s skills.
8. The user reviews the skill cards and generated service packages with suggested naira prices.
9. The app creates a one-page profile preview and shows an opportunity list with explanation text.
10. The user can screenshot or share the profile, or click through to a suggested opportunity.
11. The app persists the profile and any in-progress follow-up answers in browser localStorage so the user can return without sign-up.

## Stack
- Frontend: React + Vite + TypeScript
- Styling: plain CSS modules or a lightweight component styling approach; no heavy UI framework needed
- Runtime: browser-based app served as a mobile-friendly web app
- API layer: a small serverless function or Node route that calls a lightweight LLM provider
- Persistence: browser localStorage for the current session only
- Hosting: Vercel or similar static hosting with serverless functions; no database required

Reasoning:
- React keeps the single-page flow easy to build and easy to demo on a phone.
- Vite is fast to start and easy for a proof of concept with a public demo link.
- A lightweight model call is the simplest way to simulate the core AI magic without building a full backend or data pipeline.
- Local storage avoids accounts and a database while still preserving the generated profile for a later return.
- A serverless API is used instead of exposing the model key in the browser, which keeps the flow more production-friendly and safer for a public demo.

Anything unverified: the exact model provider and final deployment platform should be confirmed during build once the learner chooses which provider is easiest to set up with their account/preferences.

## Where It Runs and How Someone Tries It
Runtime: browser app, mobile-friendly and also usable on desktop for recording a demo video.

Environment requirements:
- Node.js installed locally for development
- A model API key for the chosen provider, only stored on the backend/serverless function side
- A public hosting target if the learner wants a direct link for demoing

Start commands for local development:
- `npm install`
- `npm run dev`
- Open the local URL in the browser

Demo flow:
- Enter a sample description like “I design flyers and run social media for small businesses.”
- Review the generated skills and services.
- Show the final profile and opportunity section.
- Record a short clip demonstrating the conversion from vague description to professional profile.

Deployment is optional; the required deliverable is a public GitHub repo plus a short demo video. If the learner chooses to deploy, a Vercel app with one serverless function is the simplest public route.

## Look and Feel
- Mobile-first layout with big tap targets and short, readable copy
- Warm and supportive, not corporate or intimidating
- Light, friendly visual system: clean cards, soft contrast, generous spacing
- High trust and low friction: the app should feel like an assistant, not a complicated platform
- Tone should be encouraging and pragmatic, with direct wording and no jargon

The styling is deliberately simple so the build stays focused on the proof of concept and the user’s actual transformation.

## Components

### WelcomePrompt
Serves as the landing screen. It presents the app’s purpose, asks for a brief description of the user’s work, and includes sample prompts.
PRD ref: `prd.md > Screens and Layout`, `prd.md > Features and Behavior > Skill Discovery`.

### SkillReview
Shows the extracted skill cards, lets the user edit or remove each one, and continues to the next step when they are satisfied.
PRD ref: `prd.md > Features and Behavior > Skill Discovery`.

### ServiceBuilder
Transforms the approved skills into 2–3 service packages with price suggestions in naira and editable details.
PRD ref: `prd.md > Features and Behavior > Service Packaging`.

### ProfilePreview
Displays the one-page client-ready profile with name, bio, service list, pricing, and proof of work summary.
PRD ref: `prd.md > Features and Behavior > Professional Profile Generation`.

### OpportunityPanel
Lists short, relevant training, funding, or work opportunity suggestions and explains why they fit the person.
PRD ref: `prd.md > Features and Behavior > Opportunity Matching`.

## Data Model
The app keeps data intentionally small and session-scoped. There is no persistent user database in the proof of concept.

Core state shape:
- `promptText` — the original user input
- `followUpAnswers[]` and `currentFollowUpQuestion` — in-progress clarification conversation, if needed
- `skills[]` — array of skill objects with id, label, and description
- `services[]` — array of service objects with name, description, and priceRange
- `profile` — generated profile data: name, bio, services, skill summary, proof items
- `opportunities[]` — array of opportunity objects with title, reason, and link
- `sessionMeta` — optional timestamp and last-updated information

Where it lives:
- In the browser as React state while the user is active
- In browser localStorage so the generated profile remains available if the user returns later

How it updates:
- User writes input → state update
- Vague input → ask and save one follow-up answer at a time; combine answers with the original prompt before generation
- AI response arrives → state gets filled with structure
- User edits cards/packages → local state is changed instantly
- User leaves and returns → app reads the persisted session and restores the profile state

## File Structure
```text
project/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── components/
│   │   ├── WelcomePrompt.tsx
│   │   ├── SkillReview.tsx
│   │   ├── ServiceBuilder.tsx
│   │   ├── ProfilePreview.tsx
│   │   └── OpportunityPanel.tsx
│   ├── lib/
│   │   ├── generateProfile.ts
│   │   ├── pricing.ts
│   │   ├── storage.ts
│   │   └── sampleData.ts
│   ├── styles/
│   │   └── app.css
│   └── main.tsx
├── api/
│   └── generate-profile.ts
├── public/
│   └── favicon.svg
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
├── devpost/
│   └── ...
└── .env.example
```

## External Services and Dependencies
This app depends on a small number of external items:

- Model API provider for generation (for example OpenAI-compatible endpoint, or an equivalent lightweight provider)
  - Purpose: turn freeform text into structured skills, service packages, and profile content
  - Required inputs: user text string
  - Expected output: structured JSON with skills, services, profile, and opportunities
  - Keys: model API key stored on server-side only
  - Docs: provider documentation for request/response format and auth

- Public hosting target (Vercel or equivalent)
  - Purpose: serve the app and the serverless function to the public
  - Required inputs: deployment config and environment variables
  - Docs: hosting provider docs for static + function deployment

- No database or auth provider required for the proof of concept.

## Important Failure Modes
- **The model returns vague or generic skills** → the app shows a review step so the user can correct or remove them before proceeding.
- **The input is empty or very weak** → the app prompts for more detail instead of generating weak content.
- **The user’s pricing looks unrealistic** → price suggestions are clearly labeled as editable and intended as starting points.
- **The environment lacks a working API key during a local run** → the app falls back to seeded sample data so the UI can still be tested and recorded.
- **The app is opened on a slow connection** → the flow uses one compact page and minimal network requests, reducing friction.

## What Was Simplified and Why
- **No database** instead of stored user accounts — because the proof of concept is about proving the value of the profile-building flow, not about account management.
- **Local storage instead of real auth** — because the product is meant to work instantly for first-time users with no sign-up barrier.
- **Single-page flow instead of a multi-route app** — because a compact mobile flow is easier to demo and easier to build in a short time.
- **Seeded mock generation fallback** instead of requiring a live model at all times — because this keeps the app demoable even when keys or external access are flaky.

These simplifications preserve the kernel: the user takes a vague set of skills and turns them into a credible, shareable offer.

## Decisions and Open Issues
- Chosen approach: browser-first web app with a lightweight AI-generated profile flow, no login, and no database.
- Why this fits: it matches the learner’s requirement for a mobile-friendly public demo and keeps the proof of concept focused on the value of turning informal work into a professional identity.
- Tradeoff accepted: the app may feel less “full production” because it is intentionally narrow and session-scoped.
- One genuine ambiguity discussed: the exact AI implementation path for the generation step. We agreed to use a small server-side model call with a fallback to sample data, while keeping the frontend free from any key exposure. This is the main technical decision to verify in the build.
- Remaining open question: the exact provider and deploy target should be confirmed once the learner chooses the easiest setup path. This does not block the build itself, because the fallback keeps the core flow functional.
