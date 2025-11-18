import type { Seguradora } from "./seguradora.types";

export interface Apolice {
  id: string;
  createdOn: string;
  valorPremio: number;
  numeroApolice: string;
  dataInicioVigencia: string;
  dataTerminoVigencia: string;
  status: string;
  tipo: string;
  nomeArquivo: string;
  clienteId: string;
  seguradoraId: string;

  seguradora: Seguradora;
} 