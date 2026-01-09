import { ZodError } from "zod";
import { statusCode } from "../types/types.js";
import { ErrorResponse } from "../utils/response.util.js";
import { zodError } from "../validation/index.js";
const errorMiddleware = (err, req, res, next) => {
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;
    if (err.name === "CastError")
        err.message = "Invalid ID";
    if ("code" in err && err.code === "P2025") {
        err.message = "Item not found";
    }
    // handle Zod error
    if (err instanceof ZodError) {
        const zodErr = zodError(err);
        res.status(statusCode.Bad_Request).json({
            success: false,
            message: "Validation Error",
            errors: zodErr,
        });
    }
    else {
        // Final Error Response
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
};
export default errorMiddleware;
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
//# sourceMappingURL=error.middleware.js.map