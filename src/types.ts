import { User, Session } from 'next-auth';

export interface UserData extends User {
    refreshToken?: string;
    accessToken?: string;
    username?: string;
    accessTokenExpires?: number;
}

export type UserSession = Session & {
    accessToken?: string;
    username?: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    username?: string;
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string
//   }
// }

export interface formData {
  username: string;
  password: string;
}

export interface Messages {
  role: String;
  content: String;
}

export interface AllHistory {
  customer_name: String;
  last_updated: String;
}