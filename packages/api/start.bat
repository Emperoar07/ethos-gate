@echo off
set JWT_SECRET=dev-local-secret-change-me
deno run --allow-net --allow-env --allow-read --allow-write main.ts
