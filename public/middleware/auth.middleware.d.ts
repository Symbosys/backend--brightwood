import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: string;
                email: string;
                role: string;
                schoolId: string;
            };
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorize: (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map