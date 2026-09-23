# Desk Clock

A smart desk dashboard built with Next.js that combines a live clock, alarm management, weather, and task tracking into a single personal productivity screen. It is designed for a landscape smartphone display, supports swipe navigation between screens, and can be installed as a progressive web app.

## Overview

Desk Clock is a small productivity-focused dashboard for a desk or wall display. It helps you:

- track the current time and date
- manage repeating and one-time alarms
- view upcoming alarms and snooze state
- check the current weather
- keep track of Google Tasks
- switch between screens with swipe gestures or simple navigation patterns
- use the app like a lightweight dashboard on desktop or mobile devices

The app stores alarms locally in browser storage and integrates with Google Tasks through a Next.js API layer and Supabase-managed refresh tokens.

## Deployment

You can find the application at https://binarydeskclock.vercel.app/

## Features

- Live clock and date display
- Alarm system with audio escalation and snooze behavior
- Repeating alarms and alarm labels
- Weather data integration via WeatherAPI
- Task management with Google Tasks API
- Swipe-based screen transitions between clock, alarms, weather, and tasks
- Status bar that surfaces important updates like active alarms and upcoming reminders
- PWA support for installability and offline-friendly behavior
- Clean TypeScript + React architecture with Next.js app router

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase JavaScript client
- Google APIs client library
- next-pwa for PWA behavior
- WeatherAPI for weather data

## Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── google/
│   │   │       └── callback/
│   │   ├── binary/
│   │   │   └── alarms/
│   │   ├── tasks/
│   │   └── weather/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Alarms/
│   ├── Clock/
│   ├── StatusBar/
│   ├── Tasks/
│   ├── Timer/
│   └── Weather/
├── context/
│   └── AlarmContext.tsx
├── hooks/
│   ├── useClock.ts
│   └── useTasks.tsx
├── lib/
│   └── supabase.ts
├── public/
│   ├── icons/
│   ├── manifest.json
│   ├── sw.js
│   └── workbox-*.js
├── types/
│   ├── alarm.ts
│   ├── next-pwa.d.ts
│   └── task.ts
├── .env.example
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── ...
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 20.15+ recommended
- npm
- Access to a Supabase project
- A WeatherAPI key
- A Google Cloud project with Tasks API enabled

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

WEATHER_API=your_weatherapi_key

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
<!-- GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback -->
```

### Notes

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are used for the Google Tasks integration and refresh-token storage.
- `WEATHER_API` is used by the weather API route to fetch current conditions.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` enable the Google OAuth flow for Google Tasks access.

## Installation

```bash
npm install
```

## Local Development

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Google Tasks Integration

The application includes Google Tasks support through the app API routes:

- `/api/auth/google` starts the OAuth flow
- `/api/auth/google/callback` receives the callback and stores the refresh token
- `/api/tasks` fetches and creates tasks using the stored Google refresh token

This allows the app to read and manage a user’s default Google Tasks list without exposing secrets in the frontend.

## Weather Integration

The weather route proxies requests to WeatherAPI:

- `/api/weather?` accepts query parameters and forwards them to the WeatherAPI endpoint
- The UI can then render current weather conditions based on location and fetch settings

## Alarm Behavior

The alarm system is implemented in the React context layer and includes:

- volume ramping over time
- audio playback control
- snooze support
- recurring alarm logic
- local persistence in browser storage

## PWA Notes

This app is configured with `next-pwa` and includes a manifest for installability. In development, the service worker is disabled; in production it can be used as a standalone app experience.

## Future Ideas

The project already points toward a more complete personal desk assistant, with possible future additions such as:

- Pomodoro / focus timer
- Google Calendar integration
- settings screen
- more advanced status prioritization
- better task filtering and reminders

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and verify the app still builds
5. Open a pull request with a clear summary of the change

## Summary

Desk Clock is a compact, personal dashboard that turns a browser into a smart desk utility. It combines time, alarms, weather, and task management in a single app, with a strong focus on quick glanceability and desktop-first usage.
