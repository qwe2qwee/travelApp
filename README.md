## travelApp

travelApp is a React Native mobile application built with Expo and TypeScript. It includes a small app shell, screen-based routing (Expo Router), and a Supabase integration for backend services.

This repository contains the app source under the `app/` directory and several reusable UI components in `components/`.

## Prerequisites

- Node.js (LTS recommended)
- npm (or Yarn)
- Optional: Android Studio / Xcode for emulators

## Install

Open a terminal in the project root and install dependencies:

```powershell
npm install
```

## Run (development)

Start the Expo dev server:

```powershell
npx expo start -c
```

This opens the Metro/Expo dev tools where you can run the app on an emulator, simulator, a physical device (Expo Go or development build), or in a web browser.

## Useful scripts

- `npm run start` — Start Expo (alias to `npx expo start`).
- `npm run reset-project` — Reset starter files (moves starter to `app-example` and creates a blank `app/`).

See `package.json` for the full list of scripts.

## Environment & Secrets

This project uses Supabase for backend integration. Supply your Supabase values via environment variables or a secure secrets file. Typical variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Check `integrations/supabase/client.ts` for how the client is initialized.

## Project structure (high level)

- `app/` — App entry and routes (Expo Router).
- `components/` — Reusable UI components.
- `assets/` — Images and static assets.
- `integrations/` — Third-party integrations (e.g., Supabase client).
- `contexts/`, `hooks/`, `constants/` — App utilities and shared state.

## Contributing

If you want to contribute or open an issue, please:

1. Fork the repo
2. Create a feature branch
3. Open a pull request with a clear description

## License

This project currently has no license file. Add one if you plan to publish or share the code.

---

If you'd like, I can also add a short development checklist, a `.env.example` file, or update `package.json` scripts. Which would you prefer next?
