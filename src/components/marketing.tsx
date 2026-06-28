import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <FileText className="size-5 text-primary" />
          Easy Contracts
        </Link>
        <Button asChild size="sm">
          <Link to="/auth">Start free</Link>
        </Button>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Easy Contracts</p>
        <Link to="/auth" className="hover:text-foreground">
          Sign in
        </Link>
      </div>
    </footer>
  );
}

export function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
      <span>{children}</span>
    </li>
  );
}

export function Step({
  icon,
  number,
  title,
  body,
}: {
  icon: React.ReactNode;
  number: number;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Step {number}</p>
        <h3 className="mt-0.5 text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}

export function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold">{q}</h3>
      <p className="mt-2 text-muted-foreground">{a}</p>
    </div>
  );
}
