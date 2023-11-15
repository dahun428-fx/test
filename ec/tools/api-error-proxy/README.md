# API error proxy

```bash
# Create .env.local
cp .env.example .env.local

# Write user name and password for dev/stg/chk env basic auth
vi .env.local

# Create targets.ts
cp targets.example.ts targets.ts

# Write target API path (regexp) and status code
vi targets.ts

# Install
npm i

# Run
npm run dev
```
