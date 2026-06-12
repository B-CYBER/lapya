import { apiFetch } from "@/lib/api";
import type { TokenResponse, User } from "@/types/user";

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export function signup(input: SignupInput): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<TokenResponse> {
  return apiFetch<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getMe(): Promise<User> {
  return apiFetch<User>("/api/auth/me");
}

export function verifyEmail(otp: string): Promise<User> {
  return apiFetch<User>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ otp }),
  });
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
