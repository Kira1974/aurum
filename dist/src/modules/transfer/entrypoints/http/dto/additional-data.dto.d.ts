import { AdditionalDataKey } from '~/modules/transfer/domain/constants/additional-data-key.enum';
export declare class AdditionalDataDto {
    [AdditionalDataKey.KEY]?: string;
    [AdditionalDataKey.CELLPHONE]?: string;
    [AdditionalDataKey.COMPANY_NAME]?: string;
}
