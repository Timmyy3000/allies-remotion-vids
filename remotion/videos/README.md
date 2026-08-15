# Remotion video workspaces

Each child folder is an independently owned video project.

```text
videos/
  waitlist/
    assets/
    components/
    compositions/
    constants/
    motion/
    styles/
    entrypoint.ts
    index.tsx
```

Use the focused entrypoint while working on one video:

```bash
bun run remotion:waitlist
```

The root entrypoint (`remotion/index.ts`) is the combined Studio for the
whole video library. Add a new video by giving it a namespaced composition ID
prefix, a focused entrypoint, and a root `Folder` registration.

Shared code belongs in `remotion/shared` only after it is used by multiple
videos. This keeps parallel work isolated and makes ownership clear: a
contributor working on one video can stay inside that video's folder.
