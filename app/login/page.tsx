"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        const email = (e.target as any).email.value
        const password = (e.target as any).password.value

        const result = await signIn("credentials", {
            redirect: true,
            email,
            password,
            callbackUrl: "/dashboard",
        })
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "250px" }}>
                <input name="email" type="email" placeholder="Correo" required />
                <input name="password" type="password" placeholder="Contraseña" required />
                <button type="submit">Entrar</button>
            </form>
        </div>
    )
}
