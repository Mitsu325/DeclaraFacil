import { SignatureType } from "./declaration.type";

export type requestStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface DeclarationRequestType {
  id: string;
  declaration: string;
  declarationSignature: SignatureType;
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
