import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests',          // 
  timeout: 30 * 1000,          // 
  retries: 2,                  // 
  reporter: 'html',            //  HTML 
  use: {
    headless: true,            // 
    viewport: { width: 1280, height: 720 }, // 
    actionTimeout: 5000,       // 
    baseURL: 'http://localhost:5173', //  URL
  },
});
