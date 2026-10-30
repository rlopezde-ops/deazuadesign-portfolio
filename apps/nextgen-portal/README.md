# Nextgen Portal

uBreakiFix by Asurion **store dashboard** prototype — arrivals, check-in, work orders, helpdesk, and customer profile explorations.

Design / UX prototype; not production.

## Stack

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS v4

## Run

From the monorepo root:

```bash
pnpm install
pnpm --filter=@asurion-core/nextgen-portal dev
```

Open [http://localhost:3005/](http://localhost:3005/)

| Script | Command |
|--------|---------|
| Dev | `pnpm dev` (port `3005`) |
| Build | `pnpm build` |
| Lint | `pnpm lint` |

## Notes

- Port `3005` is also used by [`@asurion-core/vhdp-upsell`](../vhdp-upsell/) — run only one at a time.
- Related IA exploration: [`apps/nextgen-ia-exploration/`](../nextgen-ia-exploration/)
- Related Needs Attention MVP: [`apps/nextgenpotal-needsattentionwo-mvp/`](../nextgenpotal-needsattentionwo-mvp/)
