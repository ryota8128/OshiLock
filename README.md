# OshiLock

## Setup

```bash
pnpm install
```

## Dev

```bash
# API
pnpm --filter @oshilock/be-api dev

# Mobile (同一Wi-Fi)
pnpm --filter @oshilock/mobile start

# Mobile (Tailscale経由)
REACT_NATIVE_PACKAGER_HOSTNAME=$(tailscale ip -4) pnpm --filter @oshilock/mobile start
```
