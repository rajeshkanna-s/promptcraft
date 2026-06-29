import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vite config — React + Tailwind v4 (via the official Vite plugin, no postcss config needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Honor a PORT env var (used by the preview tooling) when present.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 5173 },
});
