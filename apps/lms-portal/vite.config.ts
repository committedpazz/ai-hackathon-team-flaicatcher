import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	// @cerios/shared-types is a CommonJS workspace package (kept CJS to avoid
	// require()-of-ESM interop issues in the NestJS api-lms app). Vite treats
	// linked monorepo packages as "source" and skips its usual CJS->ESM
	// interop unless the package is explicitly pre-bundled here.
	optimizeDeps: {
		include: ["@cerios/shared-types"],
	},
});
