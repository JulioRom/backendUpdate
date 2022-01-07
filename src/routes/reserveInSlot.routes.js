import { Router } from "express";
const router = Router();

import * as reserveInSlot from "../controllers/consolidador.core/reserveInSlot.controller";

router
.route("/")
.get(reserveInSlot.reserves)
.put(reserveInSlot.slotsTakeOut);

export default router;
