---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. Launch the app and show a single prompt flow**
  Becomes usable: The app runs in the browser and accepts a short freeform description, then displays the typed text as a result card on the page.
  Why now: This proves the full UI flow works before we add AI parsing or profile generation.
  PRD ref: `prd.md > The Core Journey` (steps 1-3)
  Spec ref: `spec.md > Components`, `spec.md > File Structure`, `spec.md > Core Journey Through the System`
  Build: Scaffold the React app, keep the flow to a single screen, add a text input, show a result card when submitted, and style it for mobile.
  Verify (mechanical): Run the dev server and ensure it compiles with no terminal errors; submit sample input and confirm the page renders the result.
  Learner check: Open the app in the browser, type a short description, and confirm the result appears on-screen the way you expect.
  Commit: `Add prompt flow and result rendering`

- [x] **2. Save and restore the user’s generated profile in the browser**
  Becomes usable: The app keeps the current output when the page reloads, so the user can return without signing up.
  Why now: Browser persistence is the first real data boundary and confirms the profile survives a refresh.
  PRD ref: `prd.md > States and Boundaries` (no-account state)
  Spec ref: `spec.md > Data Model`
  Build: Add localStorage read/write around the profile state and restore it when the app starts.
  Verify (mechanical): Type a description, refresh the page, and confirm the result still loads.
  Learner check: Enter any result, refresh, and confirm it is still there without redoing the whole flow.
  Commit: `Persist generated profile in browser storage`

- [x] **3. Generate structured skills and service offers from the prompt**
  Becomes usable: The app turns the freeform input into editable skill cards and realistic service packages.
  Why now: This is the heart of the product and the core kernel the project needs to prove.
  PRD ref: `prd.md > Features and Behavior > Skill Discovery`, `prd.md > Features and Behavior > Service Packaging`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`
  Build: Replace the placeholder result with structured output: skill cards and a list of service offers with pricing suggestions.
  Verify (mechanical): Submit a sample description and confirm the generated skills and services appear with editable values.
  Learner check: Try a realistic sample like “I design flyers and run social media for small businesses,” and review whether the app captures the right work.
  Commit: `Generate editable skills and service offers`

- [x] **4. Produce a shareable profile and opportunity section**
  Becomes usable: The user sees a one-page profile they can share and a short list of fits or opportunities.
  Why now: This is the end-state the learner wants to prove and demo.
  PRD ref: `prd.md > Features and Behavior > Professional Profile Generation`, `prd.md > Features and Behavior > Opportunity Matching`
  Spec ref: `spec.md > Components`, `spec.md > Data Model`
  Build: Assemble the final profile preview and add a small, curated opportunities panel with explanatory text.
  Verify (mechanical): Generate a profile and confirm the final preview and opportunities render correctly and remain shareable.
  Learner check: Try the full flow and decide whether the final result looks credible enough to send to a real client.
  Commit: `Create shareable profile and opportunity panel`

## Hands-on Checkpoints

- [x] Early usable behavior explored — app loads and accepts a sample prompt
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Requested opening and optional voice controls: code-inspired welcome, work-to-offer diagram, browser voice typing adds editable text without auto-submitting, and bio read-aloud starts/stops only on request; typed flow, mobile layout, reduced motion, and light/dark contrast remain intact
- [x] Flipped interaction: vague input and optional question-start button lead to 2–3 one-at-a-time AI questions, answers persist and join the original prompt, and AI question failures skip to the existing fallback; mobile and reduced-motion behavior are checked
- [x] Light/dark theme: system preference is respected by default, the accessible toggle changes theme and persists it in localStorage, both color schemes retain readable contrast, and the mobile layout is checked
- [x] Requested UI refinements: soothing loading state, result-card entrance animation, button feedback, and clearer Value Profile — build passes and changes are explored in the browser
- [x] Final review complete — learner confirmed the requested opening and voice controls work as intended

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Verified the end-to-end flow with a production build (`npm run build`) and a live browser check of the sample prompt, skill cards, service packages, and persisted localStorage state.
Route and stops: `src/App.tsx` — prompt input, `requestFollowUp()`, combined answers, and localStorage; `server/follow-up.js` — one-question-at-a-time model request and fallback; `generateProfile()` — final profile request.
Edit outcome: Kept the small styling polish for the service section and profile summary to make the proof-of-concept feel more complete without changing the product boundary.
Reflection: Offered and covered as a brief project-grounded recap: the key reusable practice is defining an observable result for a vague input and testing it with a real build and browser check.
Activity mode: learn

## Revisions
- Updated the plan to reflect the working MVP shape actually built: a single-page profile builder with prompt-to-skill generation, storage persistence, service pricing suggestions, and opportunity cards. The original plan remained valid; implementation simply filled the same kernel with more realistic output.
- The learner confirmed the loading state and card fade-in work smoothly, and requested more spacing in the Value Profile on mobile. Increased its mobile padding and separation without changing desktop layout.
- Added a final-review item for the requested light/dark theme so system preference, explicit selection, persistence, contrast, and mobile layout are checked together.
- The learner confirmed the theme works and looks good in both modes; final review is complete.
- Added a final-review item and updated the PRD/spec for the requested flipped interaction; it preserves the existing profile journey and fallback while clarifying only short/vague input.
- The build passed; mocked service checks verified sequential questioning and fallback, and one live local request returned an AI-generated follow-up question. Learner browser review was skipped, so mobile/interaction review remains open.
- The learner confirmed the theme and flipped interaction work; final browser review is complete.
- The learner approved the optional browser-native voice controls and code-inspired opening; the production build passed, the 390px viewport check kept the hero and main prompt controls visible, and the learner confirmed the opening and voice controls work as intended.
