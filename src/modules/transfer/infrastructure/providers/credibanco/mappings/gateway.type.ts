export interface GatewayClientRequest {
  transactionId: string;
  transaction: {
    amount: {
      value: number;
      currency: string;
    };
    description: string;
  };
  transactionParties: {
    payer?: {
      customerId: string;
      documentType: string;
      documentNumber: string;
    };
    payee: {
      customerId: string;
      documentType: string;
      documentNumber: string;
      accountInfo: {
        value: string;
      };
    };
  };
  additionalData: Record<string, string>;
}

export interface GatewayClientResponse {
  transactionId: string;
  externalTransactionId: string;
  responseCode: string;
  message: string;
  additionalData?: Record<string, string>;
}
