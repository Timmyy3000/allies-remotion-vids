# Allies Interface

The web and mobile clients for Allies.

## Applications

- `apps/web`: Next.js web application
- `apps/mobile`: Expo mobile application

## Development

Install all workspace dependencies from the repository root:

```bash
bun install
```

Run the web application:

```bash
bun run dev:web
```

Run the mobile application:

```bash
bun run dev:mobile
```

## Remotion videos

Each video lives in its own folder under `remotion/videos`. The current
waitlist video is at `remotion/videos/waitlist` and owns its compositions,
components, motion code, constants, assets, and styles.

Open the Studio with every video registered:

```bash
bun run remotion
```

Open only the waitlist video:

```bash
bun run remotion:waitlist
```

Render the waitlist intro:

```bash
bun run remotion:render:waitlist
```

When adding another video, create `remotion/videos/<video-name>` with its own
`index.tsx` registry and `entrypoint.ts`. Register it in `remotion/Root.tsx`
inside a Remotion `Folder`. Put code in `remotion/shared` only when it is
genuinely reused by two or more videos; videos should not import another
video's private implementation files.
