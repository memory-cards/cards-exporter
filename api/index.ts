import { Router } from "express";
import dateController from "./date";

const router = Router();

router.get("/api/date", dateController);

export default router;
