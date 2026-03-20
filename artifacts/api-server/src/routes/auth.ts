import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

router.get("/auth/user", (req: Request, res: Response) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.json({ success: true });
});

export default router;
