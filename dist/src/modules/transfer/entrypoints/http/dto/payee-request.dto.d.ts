import { KeyDto } from './key.dto';
export declare class PayeeRequestDto {
    customerId: string;
    documentType: string;
    documentNumber: string;
    key?: KeyDto;
}
