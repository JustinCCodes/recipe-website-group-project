"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";
import { SubmitButton } from "./SubmitButton";
import type { LoginFormState } from "../types";

/**
 * LoginForm
 * Uses useActionState with loginAction
 * Displays server side validation errors
 * Renders email + password inputs
 */
export default function LoginForm() {
  const initialState: LoginFormState = {};
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action={formAction} className="w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Display general error message */}
        {state?.message && !state.errors && (
          <div className="alert alert-error">{state.message}</div>
        )}

        {/* Email input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className="input input-bordered w-full"
            autoComplete="email"
          />
          {state?.errors?.email && (
            <span className="text-error text-xs mt-1">
              {state.errors.email[0]}
            </span>
          )}
        </div>

        {/* Password input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            required
            className="input input-bordered w-full"
            autoComplete="current-password"
          />
          {state?.errors?.password && (
            <span className="text-error text-xs mt-1">
              {state.errors.password[0]}
            </span>
          )}
        </div>

        <SubmitButton label="Login" loadingLabel="Logging in..." />

        {/* Link to register page */}
        <div className="text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <a href="/register" className="link link-primary">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
