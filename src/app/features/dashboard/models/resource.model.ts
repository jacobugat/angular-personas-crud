export interface ClienteNota {
  id?: number;
  texto: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ClienteArchivo {
  id?: number;
  nombreOriginal: string;
  tipoContenido: string;
  tamanoBytes: number;
  fechaCarga?: string;
}

export interface Resource {
  id?: number;
  nombre: string;
  apellido: string;
  tipoCedula: 'V-' | 'E-';
  cedula: string;
  rif?: string;
  whatsapp?: string;
  estadoCliente?: 'NO_COMPRO' | 'CITA' | 'COMPRO';
  agenteVendedor?: string;
  fechaCita?: string;
  interesado?: string;
  email: string;
  direccionPostal?: string;
  autorizaTratamientoDatos?: boolean;
  notas?: ClienteNota[];
  archivos?: ClienteArchivo[];
}
