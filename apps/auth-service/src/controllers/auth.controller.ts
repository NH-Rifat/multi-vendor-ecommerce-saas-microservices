import { Request, Response, NextFunction } from "express";
import { validationRegistrationData } from "../utils/auth.helper";
import { prisma } from "../lib/prisma";

// Register a new user
export const userRegistration =async (req: Request, res: Response, next: NextFunction) => {
  try {
    validationRegistrationData(req.body, "user");
    const { name, email, password } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    await checkOtpRestriction(email,next);

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  } catch (error) {
    next(error);
  }
}