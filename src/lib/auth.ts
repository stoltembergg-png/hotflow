import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "hotflow-jwt-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  orgId: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export const ROLES = [
  "owner",
  "admin",
  "manager",
  "editor",
  "finance",
  "viewer",
] as const;

export type Role = (typeof ROLES)[number];

export function hasPermission(role: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = {
    owner: 6,
    admin: 5,
    manager: 4,
    editor: 3,
    finance: 3,
    viewer: 1,
  };
  return hierarchy[role] >= hierarchy[requiredRole];
}
