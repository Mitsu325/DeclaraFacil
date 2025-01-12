export type SignatureType = 'director' | 'requester';

export interface Declaration {
  id: string;
  type: string;
  title: string;
  content: string;
  footer: string;
  signatureType: SignatureType;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}
