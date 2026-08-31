import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useHotelSettings } from "@/hooks/useHotel";

export default function RegisterPage() {
  const { register } = useAuth();
  const { data: hotel } = useHotelSettings();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    navigate("/my-bookings", { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-5 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-serif text-2xl">
          {hotel?.name || "Your Hotel"}
        </Link>
        <div className="mt-8 border border-border bg-card p-8">
          <h1 className="font-serif text-2xl">Create an account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Book faster and track your stays.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
            </div>
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
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" />
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
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
