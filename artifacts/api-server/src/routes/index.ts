import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import fundingRouter from "./funding";
import aiRouter from "./ai";
import applicationsRouter from "./applications";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(aiRouter);
router.use(fundingRouter);
router.use(applicationsRouter);

export default router;
