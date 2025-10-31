import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("login")
    }
    return (
        <main style={{ padding: "40px" }}>
            <h1>Bienvenida, {session.user?.name}</h1>
            <p>Esta es tu página privada (dashboard)</p>
        </main>
    )
}

