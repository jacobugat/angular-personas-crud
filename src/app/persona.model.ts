export interface Persona {
    id?: number;      // El '?' significa que es opcional (porque al crear uno nuevo, el ID no existe todavía)
    nombre: string;
    apellido: string;
    email: string;
}