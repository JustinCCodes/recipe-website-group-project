"use client";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    phone: "",
    country: "",
    terms: false,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    if (name === "password" || name === "confirmPassword") {
      const newPassword = name === "password" ? value : formData.password;
      const newConfirm =
        name === "confirmPassword" ? value : formData.confirmPassword;
      if (newConfirm && newPassword !== newConfirm) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match. Please correct it.");
      return;
    }
    setPasswordError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const newErrors: Record<string, string> = {};
          for (const error of data.errors) {
            const fieldName = error.path[0];
            newErrors[fieldName] = error.message;
          }
          setFormErrors(newErrors);
        } else {
          setFormErrors({ general: data.message || "Registration failed." });
        }
      } else {
        router.push("/login");
      }
    } catch (err) {
      setFormErrors({ general: "Failed to connect to the server." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 bg-base-100 rounded-xl shadow-lg"
        noValidate
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center">Create an Account!</h2>
        {formErrors.general && (
          <div className="alert alert-error">{formErrors.general}</div>
        )}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            name="username"
            placeholder="yourusername"
            className={`input input-bordered w-full ${
              formErrors.username ? "input-error" : ""
            }`}
            value={formData.username}
            onChange={handleChange}
            required
            minLength={3}
            autoComplete="off"
          />
          {formErrors.username && (
            <span className="text-error text-xs mt-1">
              {formErrors.username}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="your.email@example.com"
            className={`input input-bordered w-full ${
              formErrors.email ? "input-error" : ""
            }`}
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {formErrors.email && (
            <span className="text-error text-xs mt-1">{formErrors.email}</span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            className={`input input-bordered w-full ${
              formErrors.password ? "input-error" : ""
            }`}
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
          {formErrors.password && (
            <span className="text-error text-xs mt-1">
              {formErrors.password}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            className={`input input-bordered w-full ${
              passwordError ? "input-error" : ""
            }`}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />

          {passwordError && (
            <span className="text-error text-xs mt-1">{passwordError}</span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Birthdate</span>
          </label>
          <input
            type="date"
            name="birthdate"
            className={`input input-bordered w-full ${
              formErrors.birthdate ? "input-error" : ""
            }`}
            value={formData.birthdate}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          {formErrors.birthdate && (
            <span className="text-error text-xs mt-1">
              {formErrors.birthdate}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Phone</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="+49 176 123 4567"
            className={`input input-bordered w-full ${
              formErrors.phone ? "input-error" : ""
            }`}
            value={formData.phone}
            onChange={handleChange}
            autoComplete="off"
          />
          {formErrors.phone && (
            <span className="text-error text-xs mt-1">{formErrors.phone}</span>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Country</span>
          </label>
          <select
            name="country"
            className={`select select-bordered w-full ${
              formErrors.country ? "select-error" : ""
            }`}
            value={formData.country}
            onChange={handleChange}
            required
            autoComplete="off"
          >
            <option value="" disabled>
              Select your country
            </option>
            <option value="de">Germany</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="fr">France</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option>
            <option value="other">Other</option>
          </select>
          {formErrors.country && (
            <span className="text-error text-xs mt-1">
              {formErrors.country}
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="cursor-pointer label justify-start gap-4">
            <input
              type="checkbox"
              name="terms"
              className="checkbox checkbox-primary"
              checked={formData.terms}
              onChange={handleChange}
              required
            />
            <span className="label-text">
              I agree to the Terms & Conditions
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <a href="/login" className="link link-primary link-hover">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
