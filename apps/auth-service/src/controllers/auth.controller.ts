import { Request, Response, NextFunction } from "express";
import { checkOtpRestriction, sendOtp, trackOtpRequests, validationRegistrationData } from "../utils/auth.helper";
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
    await trackOtpRequests(email,next);
    await sendOtp(name,email,"user-registration-otp");

    res.status(200).json({ message: 'OTP sent to email for verification' });
  } catch (error) {
    next(error);
  }
}