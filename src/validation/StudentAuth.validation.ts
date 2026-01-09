import { z } from "zod";

export const studentLoginSchema = z.object({
    loginId: z.string().min(1, "Login ID is required"),
    password: z.string().min(1, "Password is required"),
});

export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
