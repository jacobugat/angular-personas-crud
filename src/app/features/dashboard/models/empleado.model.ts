export type RolEmpleado = 'ASESOR' | 'ADMINISTRADOR';

export interface UsuarioEmpleado {
  id?: number;
  username: string;
  password: string;
  role: RolEmpleado;
  mfaEnabled?: boolean;
}

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion?: string;
  notasInternas?: string;
  metaVentasMensual?: number;
  comisionesAcumuladasAnual?: number;
  propiedadesCaptadasMes?: number;
  fechaContratacion?: string;
  usuario: UsuarioEmpleado;
}
