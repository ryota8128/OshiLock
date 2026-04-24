import { logger } from 'hono/logger';

export const requestLogger = logger((message, ...rest) => {
  const now = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
  console.log(`[${now}] ${message}`, ...rest);
});
