import jwt from "jsonwebtoken";
import ENV from "../config/env.js";
const SECRET_KEY = ENV.JWT_SECRET || "brightwood_secret_key_12345";
const EXPIRES_IN = "30d";
const generateToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};
const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY || "");
    }
    catch (error) {
        return error;
    }
};
export const JWT = {
    generateToken,
    verifyToken,
};
//# sourceMappingURL=jwt.utils.js.map