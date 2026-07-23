import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, paymentsTable, studentsTable } from "@workspace/db";
import {
  ListStudentPaymentsParams,
  ListStudentPaymentsResponse,
  CreatePaymentParams,
  CreatePaymentBody,
  CreatePaymentResponse,
  DeletePaymentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/students/:id/payments", async (req, res): Promise<void> => {
  const params = ListStudentPaymentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const payments = await db
    .select()
    .from(paymentsTable)
    .where(eq(paymentsTable.studentId, params.data.id))
    .orderBy(paymentsTable.paidAt);

  res.json(ListStudentPaymentsResponse.parse(payments));
});

router.post("/students/:id/payments", async (req, res): Promise<void> => {
  const params = CreatePaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  // Verify student exists
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }

  const parsed = CreatePaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { amount, periodStart, periodEnd, ...rest } = parsed.data;
  const [payment] = await db
    .insert(paymentsTable)
    .values({
      ...rest,
      studentId: params.data.id,
      ...(amount !== undefined ? { amount: String(amount) } : {}),
      ...(periodStart !== undefined ? { periodStart: String(periodStart) } : {}),
      ...(periodEnd !== undefined ? { periodEnd: String(periodEnd) } : {}),
    })
    .returning();

  res.status(201).json(CreatePaymentResponse.parse(payment));
});

router.delete("/payments/:id", async (req, res): Promise<void> => {
  const params = DeletePaymentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [payment] = await db.delete(paymentsTable).where(eq(paymentsTable.id, params.data.id)).returning();
  if (!payment) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
