import { Router } from "express";
const router = Router();

import * as Slots from "../controllers/consolidador.core/Slots.controller";
//Filter slot data from db to show in front
router.get("/", Slots.slots);


router.get("/:reserve", Slots.findReserve);

export default router;
