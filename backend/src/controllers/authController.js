import catchAsync from '../utils/catchAsync.js';
import { signup, login } from '../services/authService.js';

export const signupHandler = catchAsync(async (req, res) => {
  const result = await signup(req.body);
  res.status(201).json({ status: 'success', data: result });
});

export const loginHandler = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);
  res.status(200).json({ status: 'success', data: result });
});