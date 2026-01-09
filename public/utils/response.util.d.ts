import type { Response } from "express";
export declare class ErrorResponse extends Error {
    message: string;
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const SuccessResponse: (res: Response, message: string, data?: any, statusCode?: number) => Response<any, Record<string, any>>;
//# sourceMappingURL=response.util.d.ts.map