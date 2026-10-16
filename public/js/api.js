// Komunikacja z lektorem AI Kurakiem (darmowy model w chmurze): serwer w przeglądarce, warstwa natywna na Androidzie.
import { backend } from "./backend.js";

export const api = {
  status: () => backend.status().catch(() => ({ ai: false })),
  chat: (payload) => backend.chat(payload),
  generate: (kind, level, topic, extra = "") => backend.generate({ kind, level, topic, extra }),
};
