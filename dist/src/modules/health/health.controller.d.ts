import { HealthCheckService, HealthCheckResult, MemoryHealthIndicator } from '@nestjs/terminus';
import { ThStandardResponse } from 'themis';
export declare class HealthController {
    private readonly health;
    private readonly _memory;
    constructor(health: HealthCheckService, _memory: MemoryHealthIndicator);
    check(): Promise<ThStandardResponse<HealthCheckResult>>;
}
