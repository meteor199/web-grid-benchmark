import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests',          // 测试用例目录
  timeout: 30 * 1000,          // 单个测试超时时间
  retries: 2,                  // 失败重试次数
  reporter: 'html',            // 生成 HTML 报告
  use: {
    headless: true,            // 是否使用无头模式
    viewport: { width: 1280, height: 720 }, // 浏览器窗口大小
    actionTimeout: 5000,       // 操作超时时间
    baseURL: 'http://localhost:5173', // 默认基 URL
  },
});
