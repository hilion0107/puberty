import HomeContent from "@/components/HomeContent";
import { headers } from "next/headers";

export const revalidate = 3600;

export default async function Page() {
  // Determine base URL for absolute fetch
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let initialPopups = [];
  let initialNotices = [];

  try {
    const [popupRes, noticeRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/popup`, { next: { revalidate: 3600 } }),
      fetch(`${baseUrl}/api/admin/notices`, { next: { revalidate: 3600 } })
    ]);

    if (popupRes.ok) {
      const data = await popupRes.json();
      initialPopups = data.popups || [];
      if (initialPopups.length === 0 && data.popup) {
        initialPopups.push(data.popup);
      }
    }

    if (noticeRes.ok) {
      const data = await noticeRes.json();
      initialNotices = (data.notices || []).filter((n: any) => n.is_pinned === 1);
    }
  } catch (e) {
    console.error("Error prefetching data:", e);
  }

  return (
    <HomeContent popups={initialPopups} notices={initialNotices} />
  );
}
