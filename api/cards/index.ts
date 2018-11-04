import { Router } from "express";
import listCards from "./listCards";
import updateCards from "./updateCards";

const router = Router();

router.get("/list", listCards);
// @todo: replace with POST and validation
// to limit user who could initiate a process
// and avoid DOS
router.get("/update", updateCards);

export default router;
