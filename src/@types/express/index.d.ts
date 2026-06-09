/* eslint-disable @typescript-eslint/no-explicit-any */
import "express";

declare global {
    namespace Express {
        interface Response {
            success: <T = any>(data?: T, message?: string, description?: string, statuscode?: number) => Response;
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

export {};
