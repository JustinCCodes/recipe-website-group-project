"use client";

import { useActionState } from "react"; // Hook to manage server actions
import { registerAction } from "../actions"; // Server action for registration
import { SubmitButton } from "./SubmitButton"; // Reusable submit button with loading state
import type { RegisterFormState } from "../types"; // Type for form state

/**
 * RegisterForm
 * Uses useActionState to call registerAction
 * Displays validation errors returned from server
 * Provides inputs for all registration fields
 */
export default function RegisterForm() {
  const initialState: RegisterFormState = {}; // Initial empty state
  const [state, formAction] = useActionState(registerAction, initialState); // Hook for form submission and state

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-base-200">
      <form
        action={formAction}
        className="w-full max-w-md p-8 space-y-4 bg-base-100 rounded-xl shadow-lg"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center">Create an Account!</h2>

        {/* Display general error message */}
        {state?.message && !state.errors && (
          <div className="alert alert-error">{state.message}</div>
        )}

        {/* Username input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            required
            className={`input input-bordered w-full ${
              state.errors?.username ? "input-error" : ""
            }`}
          />
          {/* Username error */}
          {state.errors?.username && (
            <span className="text-error text-xs mt-1">
              {state.errors.username[0]}
            </span>
          )}
        </div>

        {/* Email input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            required
            className={`input input-bordered w-full ${
              state.errors?.email ? "input-error" : ""
            }`}
          />
          {/* Email error */}
          {state.errors?.email && (
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
            className={`input input-bordered w-full ${
              state.errors?.password ? "input-error" : ""
            }`}
            autoComplete="new-password"
          />
          {/* Password error */}
          {state.errors?.password && (
            <span className="text-error text-xs mt-1">
              {state.errors.password[0]}
            </span>
          )}
        </div>

        {/* Birthdate input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Birthdate</span>
          </label>
          <input
            type="date"
            name="birthdate"
            required
            className={`input input-bordered w-full ${
              state.errors?.birthdate ? "input-error" : ""
            }`}
          />
          {/* Birthdate error */}
          {state.errors?.birthdate && (
            <span className="text-error text-xs mt-1">
              {state.errors.birthdate[0]}
            </span>
          )}
        </div>

        {/* Phone input optional */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone (Optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            className={`input input-bordered w-full ${
              state.errors?.phone ? "input-error" : ""
            }`}
          />
          {/* Phone error */}
          {state.errors?.phone && (
            <span className="text-error text-xs mt-1">
              {state.errors.phone[0]}
            </span>
          )}
        </div>

        {/* Country select */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>
          <select
            name="country"
            required
            className={`select select-bordered w-full ${
              state.errors?.country ? "select-error" : ""
            }`}
            defaultValue=""
          >
            <option value="" disabled>
              Select your country
            </option>
            <option value="de">Germany</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="it">Italy</option>
            <option value="fr">France</option>
            <option value="nl">Netherlands</option>
          </select>
          {/* Country error */}
          {state.errors?.country && (
            <span className="text-error text-xs mt-1">
              {state.errors.country[0]}
            </span>
          )}
        </div>

        {/* Submit button */}
        <SubmitButton label="Sign Up" loadingLabel="Signing Up..." />

        {/* Link to login page */}
        <div className="text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <a href="/login" className="link link-primary">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
