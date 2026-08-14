import { Leaf } from "lucide-react"
import { LoginForm } from "@/components/admin/login-form"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured()

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-border bg-ivory/80 p-8 shadow-xl shadow-sage-dark/5">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-sage-dark" />
          <span className="font-serif text-2xl font-semibold text-foreground">Luméa Admin</span>
        </div>
        <p className="mt-2 text-sm text-muted">Sign in to manage products and orders.</p>

        {!configured ? (
          <p className="mt-6 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
            Supabase isn&apos;t connected yet. Add your project keys to{" "}
            <code className="rounded bg-ivory px-1.5 py-0.5">.env.local</code> and create an admin user in
            Supabase Auth before signing in.
          </p>
        ) : (
          <div className="mt-6">
            <LoginForm />
          </div>
        )}
      </div>
    </main>
  )
}
