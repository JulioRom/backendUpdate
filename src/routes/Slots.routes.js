import { Router } from "express";
const router = Router();

import * as Slots from "../controllers/consolidador.core/Slots.controller";

router.get("/", Slots.slots);

export default router;
