"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session"; // Creates user session
import comparePassword from "@/utils/comparePassword"; // Compares plaintext vs hashed password
import generateSalt from "@/utils/saltHelper"; // Generates random salt
import hashPassword from "@/utils/hashPassword"; // Hashes password with salt
import type { LoginFormState, RegisterFormState } from "./types";

/**
 * Schema for login form fields
 */
const loginSchema = z.object({
  email: z.email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

/**
 * Login server action
 * - Validates login form data
 * - Finds user in database
 * - Verifies password using salt + hash
 * - Creates session if credentials are correct
 * - Redirects to home page on success
 */
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Parse form fields
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // Return errors if validation failed
  if (!validatedFields.success) {
    return {
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password: suppliedPassword } = validatedFields.data;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { message: "Invalid email or password." };
    }

    // Compare supplied password with stored hash
    const isPasswordCorrect = await comparePassword(
      user.password,
      user.salt,
      suppliedPassword
    );

    if (!isPasswordCorrect) {
      return { message: "Invalid email or password." };
    }

    // Create session after successful login
    await createSession(user.id);
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }

  // Redirect user to home page
  redirect("/");
}

/**
 * Schema for validating registration form fields
 */
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.email("Invalid email format."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  birthdate: z.string().pipe(z.coerce.date()),
  phone: z.string().optional(),
  country: z.string().min(2, "Please select a country."),
});

/**
 * Register server action
 * - Validates form input with Zod
 * - Checks for duplicate email
 * - Hashes and salts password
 * - Creates new user in database
 * - Redirects to login page on success
 */
export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  // Parse and validate form fields
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // Return validation errors if present
  if (!validatedFields.success) {
    return {
      message: "Please correct the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, ...rest } = validatedFields.data;

  try {
    // Prevent duplicate accounts
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        message: "An account with this email already exists.",
        errors: { email: ["Email already in use."] },
      };
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // Create new user in database
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword as string,
        salt,
        ...rest,
      },
    });
  } catch (error) {
    console.error(error);
    return { message: "An unexpected server error occurred." };
  }

  // Redirect to login page after registration
  redirect("/login");
}
