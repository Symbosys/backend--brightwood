import z from "zod";
export const AcademicValidation = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    schoolId: z.string(),
});
//# sourceMappingURL=Academic.validation.js.map