import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, HealthCheckResult, MemoryHealthIndicator } from '@nestjs/terminus';
import { ThStandardResponse } from 'themis';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly _memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<ThStandardResponse<HealthCheckResult>> {
    const MAX_HEAP_USAGE_BYTES: number = 300 * 1024 * 1024;
    const dataResponse = await this.health.check([
      async () => this._memory.checkHeap('memory_heap', MAX_HEAP_USAGE_BYTES)
    ]);
    return { code: 200, message: 'api service running', data: dataResponse };
  }
}
