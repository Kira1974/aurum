import { Body, Controller, Inject, Post, UseFilters } from '@nestjs/common';
import { ThLogger, ThLoggerService } from 'themis';

import { CreateTransferRequestDto, CreateTransferResponseDto } from '~/modules/transfer/entrypoints/http/dto';
import { TransferMapper } from '~/modules/transfer/entrypoints/http/mappings/transfer.mapper';
import { ICreateTransferUseCase } from '~/modules/transfer/application/ports';
import { TOKENS } from '~/shared/constants/tokens.constant';
import { TransferExceptionFilter } from '~/modules/transfer/entrypoints/http/filters/transfer-exception.filter';

@Controller({ path: 'transfers', version: '1' })
@UseFilters(TransferExceptionFilter)
export class TransferController {
  private readonly logger: ThLogger;

  constructor(
    @Inject(TOKENS.CREATE_TRANSFER_USE_CASE)
    private readonly createTransferUseCase: ICreateTransferUseCase,
    private readonly loggerService: ThLoggerService
  ) {
    this.logger = this.loggerService.getLogger(TransferController.name);
  }

  @Post()
  async createTransfer(@Body() dto: CreateTransferRequestDto): Promise<CreateTransferResponseDto> {
    this.logger.log(`Received createTransfer request with DTO: ${JSON.stringify(dto)}`); //TODO: Select fields for trace
    const createTransferResult = await this.createTransferUseCase.execute(TransferMapper.toEntity(dto));
    return TransferMapper.toCreateTransferResponseDto(createTransferResult);
  }
}
