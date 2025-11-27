import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckResult, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

import { HealthController } from '~/modules/health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;
  let memoryHealthIndicator: MemoryHealthIndicator;

  const mockHealthCheckService = {
    check: jest.fn()
  };

  const mockHealthIndicator = {
    checkHeap: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: mockHealthCheckService },
        { provide: MemoryHealthIndicator, useValue: mockHealthIndicator }
      ]
    }).compile();

    controller = module.get(HealthController);
    healthCheckService = module.get(HealthCheckService);
    memoryHealthIndicator = module.get(MemoryHealthIndicator);
  });

  it('should return standard health check response', async () => {
    const mockHealthResult: HealthCheckResult = {
      status: 'ok',
      info: {
        memory_heap: {
          status: 'up',
          used: 123456,
          limit: 314572800
        }
      },
      error: {},
      details: {
        memory_heap: {
          status: 'up',
          used: 123456,
          limit: 314572800
        }
      }
    };

    (memoryHealthIndicator.checkHeap as jest.Mock).mockResolvedValue(mockHealthResult.details.memory_heap);
    (healthCheckService.check as jest.Mock).mockImplementation(async (callbacks: any[]) => {
      const details = {};
      for (const cb of callbacks) {
        details['memory_heap'] = await cb();
      }
      return {
        status: 'ok',
        info: details,
        error: {},
        details
      };
    });

    const result = await controller.check();

    expect(healthCheckService.check).toHaveBeenCalled();
    expect(memoryHealthIndicator.checkHeap).toHaveBeenCalledWith('memory_heap', 300 * 1024 * 1024);
    expect(result).toStrictEqual({
      code: 200,
      message: 'api service running',
      data: mockHealthResult
    });
  });
});
