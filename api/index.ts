/* istanbul ignore file */
import { Router } from "express";
import buggyEndpoint from "./buggyEndpoint";
import cardsRouter from "./cards";
import dateController from "./date";

const router = Router();

router.get("/api/date", dateController);
router.use("/api/cards", cardsRouter);
router.use("/api/buggyEndpoint", buggyEndpoint);

export default router;
