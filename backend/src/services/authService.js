import AppError from '../utils/AppError.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { findUserByEmail, createUserWithStudent } from '../repositories/authRepository.js';

export const signup = async (payload) => {
  const { email, password, fullName, studentId, department, phone } = payload;

  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new AppError('Email already exists', 400);

  const hashedPassword = await hashPassword(password);
  const newUser = await createUserWithStudent(
    { email, password: hashedPassword },
    { fullName, studentId, department, phone }
  );

  const token = signToken({ userId: newUser.id, email: newUser.email, role: newUser.role });
  const { password: _, ...userWithoutPassword } = newUser;

  return { token, user: userWithoutPassword };
};

export const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new AppError('Invalid credentials', 401);

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};