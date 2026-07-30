import "../admin.css";
import { LoginForm } from "./LoginForm";

export const metadata = { title: { absolute: "Вход — админка Hit Ceramics" }, robots: { index: false, follow: false } };

/** Next 16: searchParams — Promise. */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="a-shell flex min-h-screen items-center justify-center bg-graphite-deep p-6">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="font-display text-2xl font-extrabold text-sand">Hit Ceramics</div>
          <div className="a-eyebrow mt-2 text-sand/40">Админка · ступени и террасы</div>
        </div>
        <div className="rounded-card bg-white p-7 shadow-card">
          <h1 className="a-h1 text-2xl">Вход</h1>
          <p className="a-muted mt-1 mb-5 text-sm">
            Управление ценами, контентом, заявками и метками CRM.
          </p>
          <LoginForm next={next} />
          {process.env.NODE_ENV !== "production" ? (
            <p className="a-muted mt-5 border-t border-sand-divider pt-4 text-xs">
              Пароль задаётся переменной <code>ADMIN_PASS</code>; в деве по умолчанию{" "}
              <code>stupeni</code>.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
