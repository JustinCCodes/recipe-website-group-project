"use client";

import { useFormStatus } from "react-dom"; // Hook to detect form submission status

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
  const { pending } = useFormStatus(); // Tracks if the form is currently submitting

  return (
    <button
      type="submit"
      className="btn btn-primary w-full no-animation"
      disabled={pending} // Disable button while form is submitting
    >
      {pending ? (
        <>
          {/* Spinner shown while form is submitting */}
          <span className="loading loading-spinner"></span>
          {loadingLabel}
        </>
      ) : (
        label // Default button label when not submitting
      )}
    </button>
  );
}
