import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create Account — Royal Stay Inn" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signup(username, email, password);
      toast.success("Account created! Welcome to Royal Stay Inn 🎉");
      navigate({ to: "/" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setLoading(false); }
  };

  return (
    <SiteShell>
      <div className="min-h-[calc(100svh-80px)] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-primary/5 via-background to-amber-500/5">
        <div className="w-full max-w-md animate-fadeInUp opacity-0" style={{ animationDelay: "0.1s" }}>
          <div className="rounded-3xl border-2 border-amber-400/20 bg-white shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary via-amber-500 to-primary" />

            <div className="p-6 sm:p-8">
              <div className="text-center mb-7">
                <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-serif text-2xl shadow-xl shadow-primary/25 mb-4">R</div>
                <h1 className="font-serif text-2xl sm:text-3xl tracking-tight">Join Royal Stay Inn</h1>
                <p className="mt-1.5 text-sm text-muted-foreground">Create your account and unlock exclusive luxury</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 border-2 focus:border-primary transition-colors" placeholder="Your full name" />
                  </div>
                </div>
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
                      className="pl-10 pr-10 h-11 border-2 focus:border-primary transition-colors" placeholder="Min. 6 characters" />
                    <button type="button" onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${password.length >= i * 2 ? (password.length >= 8 ? "bg-green-500" : "bg-amber-500") : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Must be at least 6 characters</p>
                </div>
                <Button type="submit" size="lg" className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 font-bold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating Account…
                    </span>
                  ) : "Create Account"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>

              {/* Benefits */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[{ icon: "🎁", label: "Exclusive Deals" }, { icon: "⚡", label: "Fast Booking" }, { icon: "🛡️", label: "Secure & Safe" }].map((b) => (
                  <div key={b.label} className="rounded-xl bg-amber-50/60 border border-amber-400/20 p-3">
                    <div className="text-xl mb-1">{b.icon}</div>
                    <p className="text-[10px] font-semibold text-muted-foreground">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
