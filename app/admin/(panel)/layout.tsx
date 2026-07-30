import Link from "next/link";
import "../admin.css";
import { AdminNav } from "./AdminNav";

export const metadata = {
  title: { absolute: "Админка — Hit Ceramics" },
  robots: { index: false, follow: false },
};

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="a-shell md:flex">
      <aside className="bg-graphite-deep text-sand md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col">
        <div className="flex items-center justify-between border-b border-sand/10 px-5 py-4 md:block md:py-5">
          <Link href="/" className="block font-display text-lg font-extrabold text-sand">
            Hit Ceramics
          </Link>
          <div className="a-eyebrow mt-0 text-sand/40 md:mt-1">Админка</div>
        </div>
        <div className="md:flex-1 md:overflow-y-auto">
          <AdminNav />
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 sm:p-7 md:p-10">{children}</main>
    </div>
  );
}
