import { CreateTransferRequestDto } from '~/modules/transfer/entrypoints/http/dto/create-transfer-request.dto';
import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';

import { CreateTransferRequestFactory } from '../../../factories/http/dto/create-transfer-request.factory';

export class CreateTransferRequestMother {
  static valid(): CreateTransferRequestDto {
    return CreateTransferRequestFactory.create();
  }

  static withAdditionalData(keys: Partial<Record<AdditionalDataKey, string>>): CreateTransferRequestDto {
    return CreateTransferRequestFactory.createWithAdditionalData(keys);
  }

  static withoutAccountInfo(): CreateTransferRequestDto {
    return CreateTransferRequestFactory.createWithoutAccountInfo();
  }
}
