import { type Apolice } from "./apolice.types";

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  status: string;
  notas?: string;
  createdOn?: string; 
  apolices: Apolice[];
}