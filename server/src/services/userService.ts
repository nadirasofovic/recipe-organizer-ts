import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDatabase } from "./database.js";
import { createId } from "./database.js";
import type { User, CreateUserDto, LoginDto, AuthResponse } from "../types/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// Create new user
export async function createUser(data: CreateUserDto): Promise<User> {
  const db = getDatabase();

  // Check if user exists
  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ? OR username = ?")
    .get(data.email, data.username) as User | undefined;

  if (existingUser) {
    throw new Error("User with this email or username already exists");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 10);

  const user: User = {
    id: createId(),
    username: data.username,
    email: data.email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  db.prepare(
    "INSERT INTO users (id, username, email, passwordHash, createdAt) VALUES (?, ?, ?, ?, ?)"
  ).run(user.id, user.username, user.email, user.passwordHash, user.createdAt);

  return user;
}

// Login user
export async function loginUser(data: LoginDto): Promise<AuthResponse> {
  const db = getDatabase();

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(data.email) as User | undefined;

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
}

// Get user by ID
export function getUserById(id: string): User | null {
  const db = getDatabase();
  return (db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User) || null;
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

