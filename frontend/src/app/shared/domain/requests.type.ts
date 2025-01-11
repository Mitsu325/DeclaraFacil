export type requestStatus = 'pending' | 'processing' | 'completed' | 'rejected';
export type signatureType = 'director' | 'requester';

export interface DeclarationRequestType {
  id: string;
  declaration: string;
  declarationSignature: signatureType;
  name: string;
  requestDate: Date;
  status: requestStatus;
  url?: string;
  generationDate?: Date;
}

export interface UserRequest {
  id: string;
  declaration: string;
  attendantName?: string;
  requestDate: Date;
  status: requestStatus;
  generationDate?: Date;
}
