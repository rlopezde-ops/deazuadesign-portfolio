# Call Pacing

Gallery of **call pacing bar** visual explorations for expert call chrome — countdown / progress treatments used while a call is live.

Design prototype only; no real telephony.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS v4
- Phosphor / Lucide icons

## Run

From the monorepo root:

```bash
pnpm install
pnpm --filter=@asurion-core/call-pacing dev
```

Open [http://localhost:3009/](http://localhost:3009/)

| Script | Command |
|--------|---------|
| Dev | `pnpm dev` (port `3009`) |
| Build | `pnpm build` |
| Start | `pnpm start` |

## Related

The pacing pill that shipped in Expert Console lives in [`apps/expert-console/components/workspace/call-bar-glow.tsx`](../expert-console/components/workspace/call-bar-glow.tsx).
