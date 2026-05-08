export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isPro: boolean;
  isSuspended: boolean;
  createdAt: string;
  totpEnabled?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
