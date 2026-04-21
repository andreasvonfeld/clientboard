import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PostCSS + @tailwindcss/postcss (voir postcss.config.cjs) — évite ESM-only @tailwindcss/vite avec config TS CJS.
// Main / preload : pas de Tailwind (vite.main.config.ts, vite.preload.config.ts).
export default defineConfig({
  plugins: [react()],
});
