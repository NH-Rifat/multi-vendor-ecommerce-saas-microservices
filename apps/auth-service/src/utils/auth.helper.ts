/* eslint-disable @nx/enforce-module-boundaries */
import { ValidationError } from '@eshop/error-handler';

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

