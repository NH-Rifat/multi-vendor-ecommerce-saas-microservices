/* eslint-disable @nx/enforce-module-boundaries */
import { ValidationError } from '@eshop/error-handler';
import { NextFunction } from 'express';
import crypto from 'crypto';
import redis from '../lib/redis';
import { sendEmail } from './sendMail';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const validationRegistrationData = (data:any, userType:"user" | "seller")=>{
const { name, email, password, phone_number,country } = data;

    if(!name || !email || !password || (userType =="seller" && (!phone_number || !country))){
        throw new ValidationError('Missing required fields for registration');
    }

    if(!emailRegex.test(email)){
        throw new ValidationError('Invalid email format');
    }

}

export const checkOtpRestriction = async (email:string, next: NextFunction) => {
    if(await redis.get(`otp_lock:${email}`)){
        const error = new ValidationError('Account locked due to multiple failed attempts. Please try again later after 30 minutes.');
        return next(error);
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        const error = new ValidationError('Too many OTP requests. Please try again later after 1 hour.');
        return next(error);
    }
    if(await redis.get(`otp_cooldown:${email}`)){
        const error = new ValidationError('OTP request too frequent. Please wait for a minute before requesting again.');
        return next(error);
    }

}

export const trackOtpRequests = async (email:string, next: NextFunction) => {
    const otpRequestKey = `otp_requests_count:${email}`;
    const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

    if (otpRequests >= 2) {
        await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600); // 1 hour lock
        return next(new ValidationError('Too many OTP requests. Please try again later after 1 hour.'));
    }

    await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600); // Count resets after 1 hour
}

export const sendOtp = async (name:string,email:string,template:string)=>{
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email,"verify your email",template,{name,otp});
    await redis.set(`otp:${email}`, otp, 'EX', 300); // OTP valid for 5 minutes
    await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60); // Cooldown of 1 minute
}
