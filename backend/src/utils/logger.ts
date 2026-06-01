/**
 * PRODUCTION LOGGER
 * Structured logging for debugging and monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private format(level: LogLevel, data: any): LogEntry {
    return {
      level,
      timestamp: new Date().toISOString(),
      ...(typeof data === 'string' ? { message: data } : data),
    };
  }

  private output(entry: LogEntry) {
    // In production, send to logging service (e.g., CloudWatch, Datadog)
    // For now, just console.log
    if (this.isDevelopment || entry.level === 'error' || entry.level === 'warn') {
      console.log(JSON.stringify(entry));
    }
  }

  debug(data: string | any) {
    this.output(this.format('debug', data));
  }

  info(data: string | any) {
    this.output(this.format('info', data));
  }

  warn(data: string | any) {
    this.output(this.format('warn', data));
  }

  error(data: string | any) {
    this.output(this.format('error', data));
  }
}

export const logger = new Logger();
