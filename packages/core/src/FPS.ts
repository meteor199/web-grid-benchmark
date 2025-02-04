export class FPS {
  private static startTime: number | null = null;
  private static frameCount: number = 0;
  private static running: boolean = false;
  private static prevFrameTime: number | null = null;

  public static start() {
    this.startTime = performance.now();
    this.frameCount = 0;
    this.running = true;

    requestAnimationFrame(this.frameCounter.bind(this));
  }

  public static stop() {
    this.running = false;

    const elapsed = performance.now() - this.startTime!;
    let fps = this.frameCount / (elapsed / 1000);

    fps = Math.floor(fps);

    console.log(fps);

    return fps;
  }

  private static frameCounter() {
    const time = performance.now();

    if (this.start === null) {
      this.prevFrameTime = this.startTime = time;
    } else {
      this.frameCount++;
    }

    this.prevFrameTime = time;

    if (this.running) {
      requestAnimationFrame(this.frameCounter.bind(this));
    }
  }
}
