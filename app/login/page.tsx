"use client"

import React, { useEffect, useState } from "react";
import { signIn, getProviders, ClientSafeProvider } from "next-auth/react";

export default function LoginPage() {
    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const p = await getProviders();
            setProviders(p);
        })();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const email = (e.target as any).email.value;
        const password = (e.target as any).password.value;

        // redirect true hará la redirección automática si todo OK
        const res = await signIn("credentials", {
            redirect: false, // manejamos el resultado en cliente
            email,
            password,
            callbackUrl: "/dashboard",
        });

        // @ts-ignore
        if (res?.error) {
            setError("Credenciales incorrectas. Revisa email/contraseña.");
            return;
        }

        // redirigir si no hubo error
        if (res?.ok) {
            window.location.href = (res as any).url || "/dashboard";
        }
    };

    const handleProvider = async (id: string) => {
        setLoadingProvider(id);
        // redirect true para que NextAuth se encargue de la ventana externa
        await signIn(id, { callbackUrl: "/dashboard" });
        setLoadingProvider(null);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Bienvenido</h1>
                <p className="login-subtitle">Inicia sesión en tu cuenta</p>

                <form onSubmit={handleLogin} className="login-form">
                    <label className="login-label">Correo electrónico</label>
                    <input
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        required
                        className="login-input"
                    />

                    <label className="login-label">Contraseña</label>
                    <input
                        name="password"
                        type="password"
                        placeholder="********"
                        required
                        className="login-input"
                    />

                    {error && <p className="login-error">{error}</p>}

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="login-divider">
                    <hr className="login-hr" />
                    <span className="login-divider-text">o</span>
                    <hr className="login-hr" />
                </div>

                <div className="login-providers">
                    {providers ? (
                        Object.values(providers)
                            .filter((p) => p.id === "google")
                            .map((provider) => {
                                const isLoading = loadingProvider === provider.id;
                                return (
                                    <button
                                        key={provider.id}
                                        onClick={() => handleProvider(provider.id)}
                                        className="login-google-button"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <svg className="login-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="login-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                        )}
                                        <span className="login-google-text">Continuar con Google</span>
                                    </button>
                                );
                            })
                    ) : (
                        <p className="login-loading">Cargando proveedores...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
