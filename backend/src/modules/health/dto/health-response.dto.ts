export class HealthResponseDto {
  /** "ok" when every dependency is up */
  status!: 'ok' | 'degraded';
  /** Seconds since the process started */
  uptime!: number;
  database!: 'up' | 'down';
}
