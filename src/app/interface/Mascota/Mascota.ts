export interface MascotaRequest {
    nombre: string;
    edad: number;
    peso: number;
    especie: string;
    raza: string;
    idUsuario: number;
}

export interface Mascota {
    idMascota: number;
    nombre:string;
    edad: number;
    peso: number;
    especie: string;
    raza: string;
    //usuario?: Usuario;
}