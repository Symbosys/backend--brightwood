import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "../../generated/prisma/client.js";
declare const prisma: PrismaClient<{
    adapter: PrismaMariaDb;
}, never, import("../../generated/prisma/runtime/client.js").DefaultArgs>;
export default prisma;
//# sourceMappingURL=prisma.d.ts.map