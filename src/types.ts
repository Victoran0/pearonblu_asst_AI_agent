import { User, Session } from 'next-auth';

export interface UserData extends User {
    refreshToken?: string;
    accessToken?: string;
    username?: string;
}

export type UserSession = Session & {
    refreshToken?: string;
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
    refreshToken?: string;
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