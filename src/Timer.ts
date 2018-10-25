export class Timer {
  isRunning = false;
  intervalHandle?: NodeJS.Timer;

  constructor(private readonly duration: number) {}

  stop = () => {
    this.isRunning = false;
    this.intervalHandle && clearInterval(this.intervalHandle);
  };

  run = (task: <T>() => Promise<T>) => {
    if (this.isRunning) {
      this.stop();
    }

    const executeTask = async () => {
      if (this.isRunning) {
        return;
      }

      this.isRunning = true;
      await task();
      this.isRunning = false;
    };

    this.intervalHandle = setInterval(executeTask, this.duration);
    executeTask();
  };
}
