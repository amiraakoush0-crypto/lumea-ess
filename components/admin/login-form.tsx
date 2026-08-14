"use client"

import { useActionState } from "react"
import { signIn, type LoginState } from "@/lib/actions/auth"

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-foreground">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
          placeholder="admin@lumea.com"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-foreground">Password</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1.5 w-full rounded-xl border border-border bg-ivory px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sage"
          placeholder="••••••••"
        />
      </div>

      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-full bg-sage-dark py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:scale-[1.02] hover:bg-gold-dark active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}
