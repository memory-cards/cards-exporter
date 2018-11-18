import { Router } from "express";
import cardsRouter from "./cards";
import createError from "./createError";
import dateController from "./date";

const router = Router();

router.get("/api/date", dateController);
router.use("/api/cards", cardsRouter);
router.post("/api/createError", createError);

export default router;
