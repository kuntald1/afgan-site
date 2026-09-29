import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] text-gray-800 outline-none transition-colors focus:border-[#073B70] focus:ring-2 focus:ring-[#073B70]/10";

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#073B70] to-[#0B5AA8] p-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#F5C518]/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518] text-[16px] font-extrabold text-[#073B70]">
            ACE
          </span>
          <span className="text-[16px] font-semibold">Afghanistan Center for Excellence</span>
        </div>
        <div className="relative">
          <h1 className="text-[36px] font-bold leading-tight">Manage your website with confidence.</h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/75">
            Edit page content, publish projects and blog posts, manage the gallery, post job openings and
            read enquiries — all in one place.
          </p>
        </div>
        <p className="relative text-[12px] text-white/45">ACE Admin Panel</p>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center bg-[#F3F6FB] px-6 lg:w-1/2">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#073B70] text-[14px] font-extrabold text-[#F5C518]">
              ACE
            </span>
            <span className="text-[15px] font-semibold text-[#073B70]">Admin Panel</span>
          </div>

          <h2 className="text-[26px] font-bold text-[#073B70]">Welcome back</h2>
          <p className="mb-8 mt-1.5 text-[14px] text-gray-500">Sign in to manage the ACE website.</p>

          <label className="mb-1.5 block text-[12.5px] font-semibold text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className={`mb-4 ${inputClass}`}
          />

          <label className="mb-1.5 block text-[12.5px] font-semibold text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={`mb-6 ${inputClass}`}
          />

          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#073B70] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#052c54] disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
