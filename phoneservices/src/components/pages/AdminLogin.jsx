import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAdminTokens } from "@/lib/adminAuth";
import { API_BASE } from "@/lib/apiBase";

const parseJsonOrThrow = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    const hint = text.trim().startsWith("<!DOCTYPE")
      ? "API returned HTML instead of JSON. Set VITE_API_BASE_URL to your live backend URL and redeploy."
      : "API returned invalid JSON.";
    throw new Error(hint);
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseJsonOrThrow(res);
      if (!res.ok) throw new Error(data.message || "Login failed");
      setAdminTokens({ token: data.token, refreshToken: data.refreshToken });
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(`Cannot reach API server at ${API_BASE}. Verify backend is live, URL is https, and CORS allows your Netlify domain.`);
      } else {
        setError(err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6 pt-24">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="sticky top-4 z-30 rounded-2xl border border-border bg-background/95 p-4 shadow-card backdrop-blur">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin Area</p>
              <p className="text-sm text-muted-foreground">Sign in to continue managing catalog content.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-background p-6 shadow-card space-y-4">
            <h1 className="font-display text-3xl font-black text-foreground">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage catalog content.</p>
            <input
              className="w-full rounded-lg border border-border px-3 py-2"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-border px-3 py-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              disabled={loading}
              className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
