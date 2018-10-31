import { Router } from "express";
import DateController from "./date";

const router = Router();

router.get("/api/date", DateController);

export default router;
