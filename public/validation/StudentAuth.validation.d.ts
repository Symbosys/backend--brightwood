import { z } from "zod";
export declare const studentLoginSchema: z.ZodObject<{
    loginId: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
//# sourceMappingURL=StudentAuth.validation.d.ts.map