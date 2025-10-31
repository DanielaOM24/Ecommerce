// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth"; // usa alias @ si tienes tsconfig paths, si no usa ../../..
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


//prueba git
