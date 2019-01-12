/* istanbul ignore file */
import { Router } from "express";
import cardsRouter from "./cards";
import dateController from "./date";

const router = Router();

router.get("/api/date", dateController);
router.use("/api/cards", cardsRouter);

export default router;
