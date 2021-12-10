import { Router } from "express";
const router = Router();

import * as reserveInSlot from "../controllers/consolidador.core/reserveInSlot.controller";

router.get("/", reserveInSlot.reserves);

router.put("/",reserveInSlot.slotsTakeOut);

export default router;
