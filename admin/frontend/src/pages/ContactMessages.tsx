import { useEffect, useState } from "react";
import { Trash2, Mail, Phone } from "lucide-react";
import { api, type ContactMessage } from "../lib/api";

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setMessages(await api.listMessages());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (m: ContactMessage) => {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    await api.deleteMessage(m.id);
    await load();
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-[13px] text-red-600">{error}</p>
      )}

      <h1 className="mb-6 text-[16px] font-semibold text-[#073B70]">Contact Messages</h1>

      {loading ? (
        <p className="text-[14px] text-gray-500">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-[14px] text-gray-500">
          No messages yet — submissions from the Contact page form will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#073B70]">{m.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[12.5px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {m.email}
                    </span>
                    {m.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {m.phone}
                      </span>
                    )}
                    {m.subject && (
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-medium">{m.subject}</span>
                    )}
                    <span>{new Date(m.submitted_at).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(m)}
                  className="flex flex-shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12.5px] text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-[13.5px] leading-relaxed text-gray-700">
                {m.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
