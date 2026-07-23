import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import paymentsRouter from "./payments";
import ordersRouter from "./orders";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(studentsRouter);
router.use(paymentsRouter);
router.use(ordersRouter);
router.use(adminRouter);

export default router;
