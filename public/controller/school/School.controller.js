import { asyncHandler } from "../../middleware/error.middleware.js";
import { createSchoolSchema, updateSchoolSchema } from "../../validation/School.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
export const createSchool = asyncHandler(async (req, res) => {
    const data = createSchoolSchema.parse(req.body);
    // Check for existing school with same email if provided
    if (data.email) {
        const existingSchool = await prisma.school.findUnique({
            where: { email: data.email },
        });
        if (existingSchool) {
            throw new ErrorResponse("School with this email already exists", statusCode.Conflict);
        }
    }
    const school = await prisma.school.create({
        data,
    });
    SuccessResponse(res, "School created successfully", school, statusCode.Created);
});
export const getAllSchools = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, city, state, country } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (search) {
        whereClause.OR = [
            { name: { contains: String(search) } },
            { email: { contains: String(search) } },
        ];
    }
    if (city)
        whereClause.city = { contains: String(city) };
    if (state)
        whereClause.state = { contains: String(state) };
    if (country)
        whereClause.country = { contains: String(country) };
    const [schools, total] = await Promise.all([
        prisma.school.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.school.count({ where: whereClause }),
    ]);
    SuccessResponse(res, "Schools fetched successfully", {
        schools,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        }
    }, statusCode.OK);
});
export const getSchoolById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const school = await prisma.school.findUnique({
        where: { id },
        include: {
            academicYears: true,
            // Including counts of related entities could be useful
            _count: {
                select: {
                    students: true,
                    teachers: true,
                    classes: true,
                }
            }
        },
    });
    if (!school) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }
    SuccessResponse(res, "School fetched successfully", school, statusCode.OK);
});
export const updateSchool = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateSchoolSchema.parse(req.body);
    // Check for email uniqueness if email is being updated
    if (data.email) {
        const existingSchool = await prisma.school.findUnique({
            where: { email: data.email },
        });
        if (existingSchool && existingSchool.id !== id) {
            throw new ErrorResponse("School with this email already exists", statusCode.Conflict);
        }
    }
    const school = await prisma.school.update({
        where: { id },
        data,
    });
    SuccessResponse(res, "School updated successfully", school, statusCode.OK);
});
export const deleteSchool = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.school.delete({
        where: { id },
    });
    SuccessResponse(res, "School deleted successfully", null, statusCode.OK);
});
export const getDashboardStats = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ErrorResponse("Not authorized", statusCode.Unauthorized);
    }
    const { schoolId } = req.admin;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Parallel fetch for main stats
    const [totalStudents, totalTeachers, totalFeesResult, attendanceToday] = await Promise.all([
        prisma.student.count({ where: { schoolId } }),
        prisma.teacher.count({ where: { schoolId } }),
        prisma.feePayment.aggregate({
            _sum: { amount: true },
            where: { studentFee: { student: { schoolId } } }
        }),
        prisma.studentAttendance.findMany({
            where: {
                date: today,
                student: { schoolId }
            },
            select: { status: true }
        })
    ]);
    // Calculate Attendance Percentage
    let attendancePct = 0;
    if (attendanceToday.length > 0) {
        const presentCount = attendanceToday.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
        attendancePct = Math.round((presentCount / attendanceToday.length) * 100);
    }
    // Chart Data (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    const [monthlyPayments, monthlyAdmissions] = await Promise.all([
        prisma.feePayment.findMany({
            where: {
                paymentDate: { gte: sixMonthsAgo },
                studentFee: { student: { schoolId } }
            },
            select: { paymentDate: true, amount: true }
        }),
        prisma.student.findMany({
            where: {
                enrollmentDate: { gte: sixMonthsAgo },
                schoolId
            },
            select: { enrollmentDate: true }
        })
    ]);
    // Process Chart Data
    const chartData = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    // Create base 6 months array
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        const label = monthNames[monthIndex];
        // Filter payments for this month/year
        const revenue = monthlyPayments
            .filter(p => {
            const pd = new Date(p.paymentDate);
            return pd.getMonth() === monthIndex && pd.getFullYear() === year;
        })
            .reduce((sum, p) => sum + p.amount, 0);
        // Filter admissions for this month/year
        const students = monthlyAdmissions
            .filter(s => {
            if (!s.enrollmentDate)
                return false;
            const ed = new Date(s.enrollmentDate);
            return ed.getMonth() === monthIndex && ed.getFullYear() === year;
        })
            .length;
        chartData.push({
            name: label,
            revenue,
            students
        });
    }
    // Recent Activities (Mocked/Aggregated)
    // Fetch latest 2 students and latest 2 payments to simulate activity feed
    const [recentStudents, recentPayments] = await Promise.all([
        prisma.student.findMany({
            where: { schoolId },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { firstName: true, lastName: true, createdAt: true }
        }),
        prisma.feePayment.findMany({
            where: { studentFee: { student: { schoolId } } },
            orderBy: { createdAt: 'desc' },
            take: 3,
            select: { amount: true, createdAt: true, studentFee: { select: { student: { select: { firstName: true, lastName: true } } } } }
        })
    ]);
    const recentActivities = [
        ...recentStudents.map(s => ({
            id: `student-${s.createdAt.getTime()}`,
            type: 'admission',
            user: `${s.firstName} ${s.lastName}`,
            time: s.createdAt,
            detail: 'New student admission'
        })),
        ...recentPayments.map(p => ({
            id: `payment-${p.createdAt.getTime()}`,
            type: 'payment',
            user: p.studentFee?.student ? `${p.studentFee.student.firstName} ${p.studentFee.student.lastName}` : 'Unknown',
            time: p.createdAt,
            detail: `Fee payment of $${p.amount} received`
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);
    SuccessResponse(res, "Dashboard stats fetched", {
        stats: {
            totalStudents,
            totalTeachers,
            feesCollected: totalFeesResult._sum.amount || 0,
            attendancePct
        },
        chartData,
        recentActivities
    }, statusCode.OK);
});
//# sourceMappingURL=School.controller.js.map