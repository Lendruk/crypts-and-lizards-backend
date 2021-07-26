export default class Logger {
  private static logMessage(message: string): void {
    console.log(message);
  }

  static info(message: string): void {
    this.logMessage(`[Info] - ${message}`);
  }

  static warn(message: string): void {
    this.logMessage(`[Warn] - ${message}`);
  }

  static error(message: string): void {
    this.logMessage(`[Error] - ${message}`);
  }
}
