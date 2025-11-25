import { ThLoggerService } from 'themis';
import { CreateTransferRequestDto, CreateTransferResponseDto } from '~/modules/transfer/entrypoints/http/dto';
import { ICreateTransferUseCase } from '~/modules/transfer/application/ports';
export declare class TransferController {
    private readonly createTransferUseCase;
    private readonly loggerService;
    private readonly logger;
    constructor(createTransferUseCase: ICreateTransferUseCase, loggerService: ThLoggerService);
    createTransfer(dto: CreateTransferRequestDto): Promise<CreateTransferResponseDto>;
}
