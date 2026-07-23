import { Router, type IRouter } from "express";
import { sql, eq, and, gte } from "drizzle-orm";
import { db, studentsTable, ordersTable, paymentsTable } from "@workspace/db";
import { GetAdminStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/admin/stats", async (req, res): Promise<void> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalStudentsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(studentsTable);

  const [activeStudentsRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(studentsTable)
    .where(eq(studentsTable.active, true));

  const [pendingOrdersRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));

  const [ordersThisMonthRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, startOfMonth));

  const [paymentsThisMonthRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(paymentsTable)
    .where(gte(paymentsTable.paidAt, startOfMonth));

  const ordersByServiceRows = await db
    .select({
      serviceType: ordersTable.serviceType,
      count: sql<number>`count(*)::int`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.serviceType);

  const stats = {
    totalStudents: totalStudentsRow?.count ?? 0,
    activeStudents: activeStudentsRow?.count ?? 0,
    pendingOrders: pendingOrdersRow?.count ?? 0,
    ordersThisMonth: ordersThisMonthRow?.count ?? 0,
    paymentsThisMonth: paymentsThisMonthRow?.count ?? 0,
    ordersByService: ordersByServiceRows.map((r) => ({
      serviceType: r.serviceType,
      count: r.count,
    })),
  };

  res.json(GetAdminStatsResponse.parse(stats));
});

export default router;
