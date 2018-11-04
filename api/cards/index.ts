import { Router } from "express";
import updateCards from "./updateCards";

const router = Router();

// @todo: replace with POST and validation
// to limit user who could initiate a process
// and avoid DOS
router.get("/update", updateCards);

export default router;
