import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface EmailPayload {
    email: string;
    mensajeHtml: string;
    asunto: string;
}

export async function POST(request: Request) {
    const { email, mensajeHtml, asunto }: EmailPayload = await request.json();

    if (!email || !mensajeHtml || !asunto) {
        return NextResponse.json({ res: "Faltan campos requeridos" }, { status: 400 });
    }

    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;

    if (!userMail || !passMail) {
        return NextResponse.json(
            { res: "Configuración de correo incompleta" },
            { status: 500 }
        );
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: userMail,
                pass: passMail,
            },
        });

        await transporter.sendMail({
            from: `"SendMail Daniela" <${userMail}>`,
            to: email,
            subject: asunto,
            html: mensajeHtml,
        });

        return NextResponse.json({ res: "Mensaje enviado con éxito" }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error al enviar correo:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { res: "Error al enviar el mensaje", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { res: "Error desconocido al enviar el mensaje" },
            { status: 500 }
        );
    }
}
