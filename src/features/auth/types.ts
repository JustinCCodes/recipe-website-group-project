// State type for login form
export interface LoginFormState {
  message?: string; // General error message
  errors?: {
    email?: string[]; // Validation errors for email
    password?: string[]; // Validation errors for password
  };
}

// State type for registration form
export interface RegisterFormState {
  message?: string; // General error message
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    birthdate?: string[];
    phone?: string[];
    country?: string[];
  };
}
