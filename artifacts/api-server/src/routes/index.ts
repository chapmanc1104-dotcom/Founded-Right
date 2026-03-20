import { Router, type IRouter } from "express";
import healthRouter from "./health";
import resourcesRouter from "./resources";
import checklistRouter from "./checklist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(resourcesRouter);
router.use(checklistRouter);

export default router;
