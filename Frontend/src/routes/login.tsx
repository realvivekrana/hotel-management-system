import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const searchSchema = z.object({ redirect: fallback(z.string(), "/").default("/") });

export const Route = createFileRoute("/login")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [{ title: "Sign In — Royal Stay Inn" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back! 🎉");
      navigate({ to: search.redirect as "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <SiteShell>
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
        <div className="w-full max-w-md animate-fadeInUp opacity-0" style={{ animationDelay: "0.1s" }}>
          {/* Card */}
          <div className="rounded-3xl border-2 border-amber-400/20 bg-white shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-primary via-amber-500 to-primary" />

            <div className="p-6 sm:p-8">
              {/* Logo */}
              <div className="text-center mb-7">
                <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-serif text-2xl shadow-xl shadow-primary/25 mb-4">R</div>
                <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">Welcome Back</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue your royal experience</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-2 focus:border-primary transition-colors" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-2 focus:border-primary transition-colors" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 font-bold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Signing In…
                    </span>
                  ) : "Sign In"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                New to Royal Stay Inn?{" "}
                <Link to="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
              </p>

              {/* Demo credentials */}
              <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-400/30 bg-amber-50/50 p-4">
                <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                  <span className="text-amber-500">✦</span> Demo Accounts
                </p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>User: <code className="bg-white px-1.5 py-0.5 rounded-md border border-border font-mono">demo@royalstayinn.com</code> / <code className="bg-white px-1.5 py-0.5 rounded-md border border-border font-mono">demo123</code></p>
                  <p>Admin: <code className="bg-white px-1.5 py-0.5 rounded-md border border-border font-mono">admin@royalstayinn.com</code> / <code className="bg-white px-1.5 py-0.5 rounded-md border border-border font-mono">admin123</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
