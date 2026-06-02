# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Recurlly — Subscription manager (Expo / RN)

## Stack
- Expo SDK 54, Router v6 (file-based routing), React 19.1, RN 0.81.5, TS strict
- NativeWind v5 (Tailwind CSS v4 via PostCSS) — config via `global.css` `@theme`, NOT legacy `tailwind.config.js`. Metro wrapped with `withNativewind`.
- Clerk auth (`@clerk/expo`) — requires `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`
- New Architecture + React Compiler enabled

## Commands
- `npm start` / `npm run ios` / `npm run android` / `npm run web`
- `npm run lint` — ESLint via `eslint-config-expo` (flat config)
- No test framework installed

## Conventions
- Path alias `@/*` → repo root (e.g. `@/components/`, `@/constants/`)
- Fonts: PlusJakartaSans loaded as `sans-regular`, `sans-light`, `sans-medium`, `sans-semibold`, `sans-bold`, `sans-extrabold`
- Tab icons: PNG assets from `constants/icons.ts` (not vector icons), compiled in `images.d.ts`
- Conditional classes: `clsx()` from `clsx` (no `cn()` helper)
- Shared global types: add to `type.d.ts` under `declare global {}`
- Theme tokens: defined in `global.css` `@theme` block, mirrored in `constants/theme.ts`
- Component-level Tailwind utilities in `global.css` `@layer components`
- VS Code auto-fixes + sorts imports on save

## Directory structure
- `app/` — Expo Router routes: `(auth)/` (sign-in, sign-up), `(tabs)/` (home, subscriptions, insights, settings)
- `app/home/` — home screen sub-components (BalanceCard, HomeHeader, UpcomingSubscriptionsList)
- `components/` — `cards/`, `layout/`, `list/`
- `constants/` — data, icons (PNG re-exports), images, theme (JS tokens)
- `lib/` — utility helpers
- `app-example/` — starter template moved aside (gitignored)
