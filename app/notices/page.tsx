import NoticesContent from "@/components/NoticesContent";
import { headers } from "next/headers";

export const revalidate = 3600;

export default async function Page() {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const baseUrl = `${protocol}://${host}`;

    let initialNotices = [];
    let initialItemsPerPage = 7;

    try {
        const res = await fetch(`${baseUrl}/api/admin/notices`, { next: { revalidate: 3600 } });
        if (res.ok) {
            const data = await res.json();
            initialNotices = data.notices || [];
            initialItemsPerPage = data.itemsPerPage || 7;
        }
    } catch (e) {
        console.error("Error prefetching notices:", e);
    }

    return (
        <NoticesContent initialNotices={initialNotices} initialItemsPerPage={initialItemsPerPage} />
    );
}
