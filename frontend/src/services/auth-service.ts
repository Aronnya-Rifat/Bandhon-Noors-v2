import { apiRequest } from "@/lib/api";

import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  UserPasswordChange,
UserProfileUpdate,
UserPasswordChangeResponse,
PasswordResetRequest,
PasswordResetConfirm,
AuthenticationMessage
} from "@/types/user";

export function loginCustomer(
  credentials: LoginRequest,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>(
    "/login",
    {
      method: "POST",
      body: credentials,
    },
  );
}

export function registerCustomer(
  customer: RegisterRequest,
): Promise<User> {
  return apiRequest<User>(
    "/register",
    {
      method: "POST",
      body: customer,
    },
  );
}

export function getCurrentUser(
  token: string,
): Promise<User> {
  return apiRequest<User>(
    "/me",
    {
      token,
    },
  );
}
export function updateCurrentUser(
  token: string,
  update: UserProfileUpdate,
): Promise<User> {
  return apiRequest<User>(
    "/me",
    {
      method: "PATCH",
      token,
      body: update,
    },
  );
}

export function changeCurrentUserPassword(
  token: string,
  update: UserPasswordChange,
): Promise<UserPasswordChangeResponse> {
  return apiRequest<UserPasswordChangeResponse>(
    "/me/password",
    {
      method: "POST",
      token,
      body: update,
    },
  );
}
export function requestPasswordReset(
  data: PasswordResetRequest,
): Promise<AuthenticationMessage> {
  return apiRequest<AuthenticationMessage>(
    "/password-reset/request",
    {
      method: "POST",
      body: data,
    },
  );
}


export function confirmPasswordReset(
  data: PasswordResetConfirm,
): Promise<AuthenticationMessage> {
  return apiRequest<AuthenticationMessage>(
    "/password-reset/confirm",
    {
      method: "POST",
      body: data,
    },
  );
}
