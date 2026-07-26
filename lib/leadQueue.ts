/**
 * Клиентская очередь лидов (ТЗ B.5): если отправка не удалась (обрыв сети /
 * недоступность сервера), payload сохраняется в localStorage и до-отправляется
 * при возврате онлайн или на следующей загрузке. Дубли гасит idempotencyKey на
 * сервере (/api/lead). В проде серверный персист — PostgreSQL/очередь.
 */
const KEY = "lead-queue-v1";

type QueuedLead = { url: string; body: string };

function read(): QueuedLead[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(q: QueuedLead[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(q));
  } catch {}
}

export function enqueueLead(url: string, body: string) {
  if (typeof window === "undefined") return;
  const q = read();
  q.push({ url, body });
  write(q);
}

let flushing = false;

export async function flushLeads(): Promise<void> {
  if (typeof window === "undefined" || flushing) return;
  if (navigator.onLine === false) return;
  const q = read();
  if (q.length === 0) return;
  flushing = true;
  const remaining: QueuedLead[] = [];
  for (const item of q) {
    try {
      const res = await fetch(item.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: item.body,
        keepalive: true,
      });
      if (!res.ok && res.status >= 500) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  write(remaining);
  flushing = false;
}

let installed = false;
/** Однократно вешает авто-флаш очереди при возврате онлайн. */
export function installLeadQueueAutoFlush() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  window.addEventListener("online", () => void flushLeads());
}
