import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,

  env: {
    API_URL: "http://localhost:3000",
    CYPRESS_API_KEY: "<your-api-key>",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
