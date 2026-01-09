import { z } from "zod";
export declare const teacherLoginSchema: z.ZodObject<{
    teacherLoginId: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const parentLoginSchema: z.ZodObject<{
    parentsLoginId: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type TeacherLoginInput = z.infer<typeof teacherLoginSchema>;
export type ParentLoginInput = z.infer<typeof parentLoginSchema>;
//# sourceMappingURL=UserAuth.validation.d.ts.map