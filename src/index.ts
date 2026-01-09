import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import teacherrouter from "./routes/teacher.routes.js";
import studentrouter from "./routes/student.routes.js";
import subjectrouter from "./routes/subject.routes.js";
import studentEnrollmentRouter from "./routes/studentEnrollment.routes.js";
import assignmentRouter from "./routes/teacherAssignment.routes.js";
import studentAttendanceRouter from "./routes/studentAttendance.routes.js";
import teacherAttendanceRouter from "./routes/teacherAttendance.routes.js";
import parentRouter from "./routes/parent.routes.js";
import examTermRouter from "./routes/examTerm.routes.js";
import examRouter from "./routes/exam.routes.js";
import examResultRouter from "./routes/examResult.routes.js";
import academicRouter from "./routes/academic.routes.js";
import schoolRouter from "./routes/schoo;.routes.js";
import classRouter from "./routes/class.routes.js";
import sectionRouter from "./routes/section.routes.js";
import bookRouter from "./routes/book.routes.js";
import bookIssueRouter from "./routes/bookIssue.routes.js";
import feeTypeRouter from "./routes/feeType.routes.js";
import feeStructureRouter from "./routes/feeStructure.routes.js";
import studentFeeRouter from "./routes/studentFee.routes.js";
import feePaymentRouter from "./routes/feePayment.routes.js";
const app = express();

app.use(express.json()); // ✅ REQUIRED
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    console.log("Hello World!");

});

app.use('/api/v1/teacher', teacherrouter);
app.use('/api/v1/student', studentrouter);
app.use('/api/v1/subject', subjectrouter);
app.use('/api/v1/enrollment', studentEnrollmentRouter);
app.use('/api/v1/assignment', assignmentRouter);
app.use('/api/v1/attendance', studentAttendanceRouter);
app.use('/api/v1/teacher-attendance', teacherAttendanceRouter);
app.use('/api/v1/parent', parentRouter);
app.use('/api/v1/exam-term', examTermRouter);
app.use('/api/v1/exam', examRouter);
app.use('/api/v1/exam-result', examResultRouter);
app.use('/api/v1/academic', academicRouter);
app.use('/api/v1/school', schoolRouter);
app.use('/api/v1/class', classRouter);
app.use('/api/v1/section', sectionRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/book-issue', bookIssueRouter);
app.use('/api/v1/fee-type', feeTypeRouter);
app.use('/api/v1/fee-structure', feeStructureRouter);
app.use('/api/v1/student-fee', studentFeeRouter);
app.use('/api/v1/fee-payment', feePaymentRouter);

app.use(errorMiddleware);

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
