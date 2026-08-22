export interface User {
  discord_id: string;
  pseudo: string;
  email?: string | null;
  avatar_url?: string | null;
  minecraft_uuid?: string | null;
  minecraft_username?: string | null;
  eclats: number;
  is_partner: boolean;
  partner_bonus_percent: number;
}

export interface AuthResponse extends User {
  access_token: string;
  is_new_user: boolean;
}
