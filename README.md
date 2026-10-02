# Stand

Stand is a mobile-first web app that helps young creatives turn informal digital work into a client-ready profile with service suggestions and opportunity ideas.

## Local development

1. Copy `.env.example` to `.env`.
2. Add your OpenRouter key to `.env` as `OPENROUTER_API_KEY`.
3. Keep `OPENROUTER_MODEL=openrouter/free`.
4. Install dependencies:

```bash
npm install
```

5. Start the app:

```bash
npm run dev
```

This starts:
- the Vite frontend at `http://localhost:5173`
- the local API server at `http://localhost:3001`

The frontend calls `/api/profile` for profile generation and `/api/follow-up` for the optional clarification questions. The Vite dev server proxies both routes to the local API server so the workflow works during local development.

## Vercel deployment

1. Push the repo to GitHub.
2. Import the repository into Vercel.
3. In Vercel project settings, add the environment variable:
   - `OPENROUTER_API_KEY` = your OpenRouter key
4. Keep `OPENROUTER_MODEL` set to `openrouter/free`.
5. Vercel will run `npm run build` automatically.
6. Set the project root/build config as needed for a Vite app, and use the default `dist` output directory.
7. Deploy.

The deployed app uses Vercel serverless routes at `/api/profile` and `/api/follow-up`.

## Security note

- Never commit a real API key.
- Store the key only in environment variables.
- `.env` is ignored by Git and `.env.example` contains placeholders only.
