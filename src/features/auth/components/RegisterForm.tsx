"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";
import { SubmitButton } from "./SubmitButton";
import type { RegisterFormState } from "../types";

/**
 * RegisterForm
 * Uses useActionState to call registerAction
 * Displays validation errors returned from server
 * Provides inputs for all registration fields
 */
export default function RegisterForm() {
  const initialState: RegisterFormState = {};
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-base-200">
      <form
        action={formAction}
        className="w-full max-w-md p-8 space-y-4 bg-base-100 rounded-xl shadow-lg"
        noValidate
      >
        <h2 className="text-2xl font-bold text-center">Create an Account!</h2>

        {/* Display general non input specific errors */}
        {state?.message && !state.errors && (
          <div className="alert alert-error">{state.message}</div>
        )}

        {/* Username */}
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
          {state.errors?.username && (
            <span className="text-error text-xs mt-1">
              {state.errors.username[0]}
            </span>
          )}
        </div>

        {/* Email */}
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
          {state.errors?.email && (
            <span className="text-error text-xs mt-1">
              {state.errors.email[0]}
            </span>
          )}
        </div>

        {/* Password */}
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
          {state.errors?.password && (
            <span className="text-error text-xs mt-1">
              {state.errors.password[0]}
            </span>
          )}
        </div>

        {/* Birthdate */}
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
          {state.errors?.birthdate && (
            <span className="text-error text-xs mt-1">
              {state.errors.birthdate[0]}
            </span>
          )}
        </div>

        {/* Phone */}
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
          {state.errors?.phone && (
            <span className="text-error text-xs mt-1">
              {state.errors.phone[0]}
            </span>
          )}
        </div>

        {/* Country */}
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
          {state.errors?.country && (
            <span className="text-error text-xs mt-1">
              {state.errors.country[0]}
            </span>
          )}
        </div>

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
