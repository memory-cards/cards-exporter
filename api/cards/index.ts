import { Router } from "express";
import updateCards from "./updateCards";

const router = Router();

router.get("/update", updateCards);

export default router;
