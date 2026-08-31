import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useHotelSettings } from "@/hooks/useHotel";

export default function LoginPage() {
  const { login } = useAuth();
  const { data: hotel } = useHotelSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/my-bookings";

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    navigate(res.user.role === "admin" ? "/admin" : redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-serif text-2xl">
          {hotel?.name || "Your Hotel"}
        </Link>
        <div className="mt-8 border border-border bg-card p-8">
          <h1 className="font-serif text-2xl">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your bookings and account.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Hotel staff sign in here too — the dashboard shown depends on your account role.
        </p>
      </div>
    </div>
  );
}
