"use client";

import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  label: string; // Default button text
  loadingLabel: string; // Text shown while form is submitting
}

/**
 * SubmitButton
 * Uses useFormStatus to detect form pending state
 * Shows spinner + loadingLabel while submitting
 * Disabled during submission to prevent double click
 */
export function SubmitButton({ label, loadingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="btn btn-primary w-full no-animation"
      disabled={pending}
    >
      {pending ? (
        <>
          <span className="loading loading-spinner"></span>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
