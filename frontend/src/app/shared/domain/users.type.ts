export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  issuing_agency: string;
  postal_code: string;
  street: string;
  house_number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  job_title?: string;
  is_admin: boolean;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
