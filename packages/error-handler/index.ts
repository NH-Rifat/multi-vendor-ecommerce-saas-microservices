export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

    constructor(message: string, statusCode: number, isOperational = true, details?: any) {
        super(message);
        // Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}

// not found error
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', details?: any) {
        super(message, 404, true, details);
    }
}

// bad request error
export class BadRequestError extends AppError {
    constructor(message = 'Bad request', details?: any) {
        super(message, 400, true, details);
    }
}

// unauthorized error
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', details?: any) {
        super(message, 401, true, details);
    }
}

// forbidden error
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', details?: any) {
        super(message, 403, true, details);
    }
}

// internal server error
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', details?: any) {
        super(message, 500, true, details);
    }
}

// validation error
export class ValidationError extends AppError {
    constructor(message = 'Validation error', details?: any) {
        super(message, 422, true, details);
    }
}

// authentication error
export class AuthenticationError extends AppError {
    constructor(message = 'Unauthorized', details?: any) {
        super(message, 401, true, details);
    }
}

// Database error
export class DatabaseError extends AppError {
    constructor(message = 'Database error', details?: any) {
        super(message, 500, true, details);
    }
}

// rate limit error
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', details?: any) {
        super(message, 429, true, details);
    }
}