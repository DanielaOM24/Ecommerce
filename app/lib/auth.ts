// lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                // solo ejemplo para DEV
                if (credentials.email === "dani@example.com" && credentials.password === "123456") {
                    return { id: "1", name: "Daniela", email: "dani@example.com" };
                }
                return null;
            },
        }),
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
};
