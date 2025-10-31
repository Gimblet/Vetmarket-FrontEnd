export interface LoginResponse {
    token: string;
    username: string;
    rol: string;
    usuarioId: number,
    expirateAt: number;
}