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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Iniciar Sesión</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm text-gray-300">Correo</label>
          <input
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-700 focus:border-blue-400 outline-none"
          />

          <label className="block text-sm text-gray-300">Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="********"
            required
            className="w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-700 focus:border-blue-400 outline-none"
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md py-2 text-white font-medium"
          >
            Entrar
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-700" />
          <span className="px-3 text-sm text-gray-400">o</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <div className="space-y-3">
          {providers ? (
            Object.values(providers).map((provider) => {
              // no mostramos Credentials como botón
              if (provider.id === "credentials") return null;

              const isLoading = loadingProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  onClick={() => handleProvider(provider.id)}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-2 rounded-md border ${
                    provider.id === "google"
                      ? "bg-white text-gray-900 hover:bg-gray-100 border-transparent"
                      : provider.id === "facebook"
                      ? "bg-blue-700 text-white hover:bg-blue-800 border-transparent"
                      : "bg-gray-700 text-gray-100 hover:bg-gray-600"
                  }`}
                >
                  {isLoading ? (
                    <svg className="h-5 w-5 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : null}
                  <span className="font-medium">
                    {provider.name === "Google" || provider.id === "google" ? "Continuar con Google" : provider.name}
                  </span>
                </button>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-400">Cargando proveedores...</p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes cuenta? <a href="/register" className="text-blue-400 hover:underline">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
