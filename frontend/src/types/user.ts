/**
 * User and authentication related types.
 *
 * Matches Bandhon Noors backend
 * authentication system.
 */


/**
 * Available user roles.
 *
 * Must match backend enum.
 */
export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "CUSTOMER";


/**
 * Basic user information.
 */
export interface User {

  id: number;

  name: string;

  email: string;

  phone: string | null;

  role: UserRole;

  is_active: boolean;

}


/**
 * Login request payload.
 */
export interface LoginRequest {

  login: string;

  password: string;
}


/**
 * Login response.
 *
 * Backend returns JWT token.
 */
export interface TokenResponse {

  access_token: string;

  token_type?: string;
}


/**
 * Registration request.
 */
export interface RegisterRequest {

  name: string;

  email: string;

  phone?: string;

  password: string;
}


/**
 * Authentication session.
 *
 * Stored on frontend after login.
 */
export interface AuthSession {

  user: User;

  access_token: string;
}
export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
}

export interface UserPasswordChange {
  current_password: string;
  new_password: string;
}
