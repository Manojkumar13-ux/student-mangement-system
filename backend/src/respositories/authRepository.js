import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: { student: true }
  });
};

export const createUserWithStudent = async (userData, studentData) => {
  return await prisma.user.create({
    data: {
      email: userData.email,
      password: userData.password,
      role: 'STUDENT',
      student: { create: studentData }
    },
    include: { student: true }
  });
};