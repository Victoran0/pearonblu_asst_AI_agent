import NextAuth, { NextAuthConfig } from "next-auth"
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import axios from "axios"
import Credentials from "next-auth/providers/credentials"
import "next-auth/jwt"
import { DecodedToken, UserData, UserSession } from '@/types';
import {jwtDecode} from 'jwt-decode';
import {JWT} from 'next-auth/jwt';



const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
//   theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  providers: [
    Credentials({
        credentials: {
            username: {},
            password: {},
        },
        async authorize(credentials) {
            try {
                // console.log('the credentials submitted; ', credentials)
                // Authenticate with the backend here
                const res = await axios.post('http://127.0.0.1:8000/api/login/', {
                    username: credentials.username,
                    password: credentials.password
                });
                const {refresh, access, username} = await res.data

                //  Return the tokens and username as the user object
                const response = {
                    id: username,
                    accessToken: access,
                    refreshToken: refresh,
                    username: username
                }
                return  response;
            } catch (error: any) {
                console.error("Login failed.", error?.response?.data);
                return null;
            }
        }
    })
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    async jwt({token, user}: {token: JWT, user?: UserData}) {
        if (user) {
            token.accessToken = user.accessToken
            token.refreshToken = user.refreshToken
            token.username = user.username

            // decode and store the access token expiration date
            const decodedToken: DecodedToken = jwtDecode(user.accessToken ?? "");
            token.accessTokenExpires = decodedToken.exp * 1000 // convert to milliseconds
        }

        // if the token is expired, refresh it
        if (Date.now() < (token.accessTokenExpires as number)) {
            return token;
        }

        // else we refresh the token
        return await refreshAccessToken(token);
    },
    async session({session, token}: {session: UserSession, token: UserData}) {
        // Add token and user info to the session
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.username = token.username;

        return session;
    }
  },
  experimental: { enableWebAuthn: true },
})

// Helper function to refresh the Access Token
async function refreshAccessToken(token: JWT) {
    try {
        const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
            refresh: token.refreshToken,
        });
        const {access} = response.data;
        const decoded: DecodedToken = jwtDecode(access);
        return {
            ...token,
            accessToken: access,
            accessTokenExpires: decoded.exp * 1000 //convert to milliseconds
        };
    } catch (error: any) {
        console.error("Failed to refresh access token: ", error.response?.data || error.message);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}