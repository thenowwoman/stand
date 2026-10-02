---
doc: prd
status: approved
---

# Stand — Product Requirements

A mobile-first tool that helps young Nigerian creatives turn informal digital skills into a credible service profile, pricing, and opportunity list they can share with clients or funders.
Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## The Core Journey
1. A user opens the app on a phone and sees a warm welcome screen with a single prompt asking what work they already do.
2. They enter a short natural-language description of their skills or work in their own words, such as “I design flyers and run social media for small businesses.” Where supported, they may dictate the description or ask the browser to read their finished bio aloud.
3. If the description is very short or vague, Stand asks two or three brief follow-up questions one at a time; users can also choose “Not sure what to write? Ask me questions.” Their answers are combined with their original description.
4. The app interprets the resulting description and creates suggested skill cards, such as Graphic Design, Content Creation, or Community Management.
5. The user reviews and edits those skill cards, removing anything inaccurate or adding missing abilities.
6. The app generates 2–3 simple service packages with suggested starting prices in naira and short descriptions of what’s included.
7. The user reviews and edits the packages, then sees a one-page professional profile summarizing their name, bio, services, pricing, and proof of work.
8. The app suggests opportunities, such as training programs, grant programs, or suitable client types, each with a short explanation of why it matches them.
9. The user can screenshot or share the profile and click through to relevant opportunities.
10. Success is that the user ends with something they can send to a client or use to apply for relevant support.

## Screens and Layout
The product is a simple mobile-first flow with a small number of screens or panels:

1. Welcome / Prompt Screen
   - Warm, code-inspired opening with a simple visual of work becoming skills and offers
   - Large headline and a single text input
   - Optional example prompts below the input
   - Optional voice typing control when supported by the browser
   - One primary action: “Show me my skills”

2. Skills Review Screen
   - A list of suggested skill cards
   - Each card includes a short label and description
   - User can edit, remove, or add skills
   - One action continues to services

3. Services / Pricing Screen
   - 2–3 service packages displayed as cards or tiles
   - Each service shows what’s included and a suggested price range in naira
   - User can edit names, included items, and price ranges
   - One action continues to profile

4. Value Profile Screen
   - One-page layout summarizing the founder’s identity and offers
   - Includes name, short bio, skills, services, pricing, and sample link or proof items
   - Optional read-aloud control for the bio when supported by the browser
   - User can copy, screenshot, or share

5. Opportunities Screen
   - Curated suggestions for relevant grants, training, and opportunities
   - Each entry includes a short “why this fits you” explanation and a link out

## Look and Feel
- Mobile-first and readable on small screens
- Warm, encouraging, and professional rather than corporate or cold
- Light, friendly design with clean cards and clear spacing
- High trust and low friction: the app should help someone feel “I can do this” instead of “this is overwhelming”
- No sign-up friction; the experience should feel immediate and practical
- Tone should be supportive, local, and realistic about informal work and emerging-market pricing

## Features and Behavior

### Skill Discovery
The user enters short natural language describing what they do. The app extracts likely skill categories and presents them as editable cards.

- As a young creative, I want the app to understand my real work in plain language so that I can turn it into a real service.
  - [ ] The user can type or paste a short description without needing technical knowledge.
  - [ ] Very short or vague descriptions can be clarified through 2–3 warm, plain-language follow-up questions asked one at a time.
  - [ ] A user can optionally start that question flow with “Not sure what to write? Ask me questions.”
  - [ ] Answers are combined with the original description before profile generation; if question generation fails, the existing fallback is used without asking more questions.
  - [ ] The app generates 3–5 skill cards that match the description.
  - [ ] The user can edit, remove, or add skills before continuing.

### Service Packaging
The app turns the selected skills into 2–3 clear service offers with simple descriptions and suggested prices.

- As a user who is not used to pricing services, I want suggested packages so that I can quickly see how my work could be sold.
  - [ ] The app creates at least 2 service offers based on the user’s skills.
  - [ ] Each service includes a simple description and a suggested starting price in naira.
  - [ ] The user can edit the service name, description, and price before continuing.

### Professional Profile Generation
The app creates a one-page profile that looks polished enough to share with clients.

- As a user who wants to get paid, I want a client-ready profile so that I can present my work professionally.
  - [ ] The profile includes a short bio, the user’s key skills, and the service list.
  - [ ] The profile reads like a professional one-page summary rather than a vague description.
  - [ ] The user can screenshot or share the profile easily from mobile.

### Opportunity Matching
The app suggests relevant grants, programs, and client opportunities that fit the user’s work.

- As a user looking for growth, I want relevant opportunities so that I can find training, support, and more work.
  - [ ] The app lists a small curated set of relevant opportunities.
  - [ ] Each opportunity includes a brief explanation of why it matches the user.
  - [ ] The user can click through to the opportunity or relevant link.

### Optional Voice Controls
- A user can explicitly start and stop browser-supported voice typing for the main description; dictated words are added to the editable field and are not submitted automatically.
- A user can explicitly start and stop browser-supported read-aloud for the generated bio.
- Voice is optional. Unsupported browsers show an inline explanation; microphone denial or speech errors leave the existing typed and visual profile flow available with a friendly status message.
- Neither voice control sends audio to Stand's API or changes profile persistence.

## States and Boundaries
- **First use** — The user sees a prompt screen and a light example list instead of a blank form.
- **Empty or vague input** — The app should encourage the user to add more detail rather than produce nonsense.
- **Follow-up flow** — The original description and answered questions remain available if the page is refreshed; the user can continue one question at a time.
- **Skill review state** — The user can remove irrelevant suggestions and continue only once they are satisfied.
- **Pricing review state** — The user can adjust suggested prices and packages before generating the profile.
- **Shared profile state** — The resulting profile is shareable and designed to be screenshot or link-based.
- **No-account state** — The app does not require sign-up or login for the demo flow.
- **Voice unavailable** — Typed input and the visible profile remain usable when browser speech features are absent or denied, with an inline explanation.

## Product Decisions
- The user should type in freeform natural language rather than choose rigid categories — this keeps the experience aligned with how people actually describe their work.
- The app focuses on one persona and one use case first: a young Nigerian creative, not a broad marketplace.
- The product is mobile-first because the target users are on their phones and working informally.
- The profile should be simple and client-facing rather than a full portfolio dashboard, because the proof of concept is about getting a credible output quickly.
- The flow is intentionally short and encouraging, so it feels actionable and not like a long onboarding experience.

## What We're Building
The proof of concept must do the following:
- Accept a short text description of a user’s work
- Suggest 3–5 relevant skill cards
- Let the user review and edit them
- Generate 2–3 service offerings with price guidance in naira
- Produce a shareable, polished one-page profile
- Suggest relevant opportunities linked to the user’s skills
- Work on a phone with a fast, low-friction flow

## Deferred From the POC
- Full multi-user accounts and authentication
- Real payment or invoicing flows
- A full freelance marketplace or gig board
- Advanced grant-matching logic or long-term user data history
- Large portfolio management, CRM, or project tracking features

## Possible Later Enhancements
- More service categories beyond creative work
- Client intake and messaging features
- Better local market pricing intelligence by skill and city
- More specialized opportunity matching for grants and training
- Personal dashboard for saved profiles and repeated use

## Non-Goals
- Building a general social network for creators
- Running payment processing or escrow
- Creating a full business management suite for agencies
- Supporting every profession in every country at launch

## Open Questions
- The exact profile data fields and the exact sample-proof structure should be confirmed before implementation if the build needs a strong demo narrative.
- The opportunity recommendations may need a clear source or feed strategy before being treated as a real feature rather than a prototype placeholder.
- The final tone and wording of generated bios and service descriptions should be validated with the user before build, to ensure they feel authentic and not overly generic.
