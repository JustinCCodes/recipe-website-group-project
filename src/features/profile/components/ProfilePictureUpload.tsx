"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfilePictureAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary no-animation"
    >
      {pending ? "Uploading..." : "Upload"}
    </button>
  );
}

export default function ProfilePictureUpload() {
  const initialState = { error: "", success: false, url: "" };
  const [state, formAction] = useActionState(
    updateProfilePictureAction,
    initialState
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Update Profile Picture</h3>
      <form action={formAction} className="flex items-center gap-4">
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        <SubmitButton />
      </form>

      {previewUrl && !state.success && (
        <div className="mt-4">
          <p className="text-sm mb-2">Image Preview:</p>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      )}

      {state.error && <p className="text-error mt-2">{state.error}</p>}
      {state.success && <p className="text-success mt-2">Upload successful!</p>}
    </div>
  );
}
