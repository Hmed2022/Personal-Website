import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  optimizeDeps: {
    exclude: ["svelte-navigator"],
  },
  plugins: [svelte()],
});

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [svelte()],
// });
