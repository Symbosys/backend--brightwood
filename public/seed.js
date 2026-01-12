import prisma from "./config/prisma.js";
import bcrypt from "bcryptjs";
/**
 * Seed script to create initial super admin account
 * Run with: npx tsx src/seed.ts
 */
async function main() {
    console.log("🌱 Starting database seeding...");
    // Check if a super admin already exists
    const existingAdmin = await prisma.admin.findFirst({
        where: { role: "super_admin" }
    });
    if (existingAdmin) {
        console.log("✅ Super admin already exists:", existingAdmin.email);
        console.log("   Skipping seed.");
        return;
    }
    // First, we need a school
    let school = await prisma.school.findFirst();
    if (!school) {
        console.log("📚 Creating default school...");
        school = await prisma.school.create({
            data: {
                name: "BrightWood Academy",
                email: "info@brightwood.edu",
                phone: "+1-555-123-4567",
                address: "123 Education Lane",
                city: "New York",
                state: "NY",
                country: "USA",
                postalCode: "10001",
                website: "https://brightwood.edu"
            }
        });
        console.log("   ✅ Created school:", school.name);
    }
    else {
        console.log("📚 Using existing school:", school.name);
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    // Create super admin
    console.log("👤 Creating super admin account...");
    const admin = await prisma.admin.create({
        data: {
            firstName: "Super",
            lastName: "Admin",
            email: "admin@brightwood.edu",
            password: hashedPassword,
            role: "super_admin",
            isActive: true,
            schoolId: school.id
        }
    });
    console.log("\n========================================");
    console.log("🎉 Seed completed successfully!");
    console.log("========================================");
    console.log("\n📧 Login Credentials:");
    console.log("   Email:    admin@brightwood.edu");
    console.log("   Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
    console.log("========================================\n");
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map