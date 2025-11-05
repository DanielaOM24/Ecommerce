"use client";
import { useState } from "react";

export default function Home() {
    const [email, setEmail] = useState("");
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Enviando...");

        try {
            const res = await fetch("/api/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    asunto,
                    mensajeHtml: `<p>${mensaje}</p>`,
                }),
            });

            const data = await res.json();
            setStatus(data.res);
        } catch {
            setStatus("Error al enviar el correo");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-6 rounded-2xl shadow-lg w-96 space-y-4"
            >
                <h1 className="text-2xl font-semibold text-center mb-4">Enviar correo</h1>

                <input
                    type="email"
                    placeholder="Correo destinatario"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Asunto"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Mensaje"
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-32 resize-none"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded font-semibold"
                >
                    Enviar
                </button>

                {status && <p className="text-center text-sm mt-2">{status}</p>}
            </form>
        </main>
    );
}
