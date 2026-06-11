import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in · Contract generator" },
      {
        name: "description",
        content: "Sign in to your account to generate personalized contracts.",
      },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/templates" });
  },
  component: AuthPage,
});

const credentialsSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Minimum 6 characters").max(72),
  confirmPassword: z.string().min(6, "Minimum 6 characters").max(72),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid data");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/templates` },
        });
        if (error) throw error;
        // When email confirmation is enabled, signUp returns no session.
        // Don't navigate (the auth guard would just bounce back to /auth) —
        // tell the user to confirm their email instead.
        if (!data.session) {
          toast.success("Account created. Check your email to confirm it.");
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          return;
        }
        toast.success("Account created. Welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Signed in");
      }
      navigate({ to: "/templates" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication error";
      toast.error(translateAuthError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <FileText className="size-6" />
          Easy Contracts
        </div>
        <div className="space-y-4 max-w-md">
          <h1 className="text-4xl font-bold leading-tight">
            Generate hundreds of contracts in seconds.
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Upload your template once, load an Excel file with your
            influencers, and download a ZIP with every contract ready.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} · Contract generator
        </p>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2 font-semibold text-lg">
            <FileText className="size-6 text-primary" />
            Easy Contracts
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Sign in" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Enter your email and password."
                : "All you need is an email to get started."}
            </p>
          </div>

          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as "login" | "signup");
              setPassword("");
              setConfirmPassword("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value={mode} className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    placeholder="••••••••"
                  />
                  {mode === "signup" && password.length > 0 && (
                    <PasswordStrength password={password} />
                  )}
                </div>
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      placeholder="••••••••"
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  {mode === "login" ? "Sign in" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very weak", color: "bg-destructive" },
    { label: "Weak", color: "bg-destructive/80" },
    { label: "Fair", color: "bg-yellow-500" },
    { label: "Good", color: "bg-emerald-500/70" },
    { label: "Strong", color: "bg-emerald-500" },
  ];
  return { score, ...levels[score] };
}

function PasswordStrength({ password }: { password: string }) {
  const { score, label, color } = getPasswordStrength(password);
  const segments = 4;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < score ? color : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function translateAuthError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "Incorrect email or password";
  if (/user already registered/i.test(msg)) return "An account with that email already exists";
  if (/email.*confirm/i.test(msg)) return "You need to confirm your email";
  if (/password/i.test(msg) && /weak|short/i.test(msg))
    return "Password is too weak";
  return msg;
}
