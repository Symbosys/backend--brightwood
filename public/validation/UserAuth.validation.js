import { z } from "zod";
export const teacherLoginSchema = z.object({
    teacherLoginId: z.string().min(1, "Teacher Login ID is required"),
    password: z.string().min(1, "Password is required"),
});
export const parentLoginSchema = z.object({
    parentsLoginId: z.string().min(1, "Parent Login ID is required"),
    password: z.string().min(1, "Password is required"),
});
//# sourceMappingURL=UserAuth.validation.js.map