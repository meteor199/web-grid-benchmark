import { test, expect } from 'playwright/test';

test('表格性能测试', async ({ page }) => {
    // 打开页面
    await page.goto('http://localhost:5173');

    // 等待表格加载完成
    const start = performance.now();
    await page.waitForSelector('#myGrid'); // 替换为实际表格加载完成的选择器
    const end = performance.now();
    console.log(`表格渲染时间: ${end - start} ms`);

    // 截屏保存
    await page.screenshot({ path: 'grid-loaded.png' });

    // 性能指标提取
    const metrics = await page.evaluate(() => ({
        fps: 60, // 示例：你可以替换为动态计算 FPS 的逻辑
        memory: performance.memory.usedJSHeapSize,
    }));
    console.log('性能指标:', metrics);

    // 检查 FPS 是否达标
    expect(metrics.fps).toBeGreaterThan(30); // 假设目标是 30 FPS 以上
});
