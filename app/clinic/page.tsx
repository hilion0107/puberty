import ClinicContent from "@/components/ClinicContent";
import { headers } from "next/headers";

export const revalidate = 3600;

export default async function Page() {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    let initialSchedules = [];

    try {
        const res = await fetch(`${baseUrl}/api/admin/schedule?all=true`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            initialSchedules = data.data || [];
        }
    } catch (e) {
        console.error("Error prefetching schedules:", e);
    }

    return <ClinicContent initialSchedules={initialSchedules} />;
}
