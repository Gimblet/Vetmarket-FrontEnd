export interface LoginResponse {
    token: string;
    username: string;
    rol: string;
    expirateAt: number;
}