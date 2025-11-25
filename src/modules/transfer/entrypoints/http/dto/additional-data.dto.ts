import { IsOptional, IsString } from 'class-validator';

import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';

export class AdditionalDataDto {
  @IsOptional()
  @IsString()
  [AdditionalDataKey.KEY]?: string;

  @IsOptional()
  @IsString()
  [AdditionalDataKey.CELLPHONE]?: string;

  @IsOptional()
  @IsString()
  [AdditionalDataKey.COMPANY_NAME]?: string;
}
