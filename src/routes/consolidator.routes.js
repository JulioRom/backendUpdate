import { Router } from "express";
const router = Router();

import * as authCtrl from "../controllers/auth.controller";
import { verifySignup } from "../middlewares";
import * as consCtrl from "../controllers/consolidador.core/consolidator.controller"

//TODO: check the library router
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.all(
  "/:lpn",
  [consCtrl.reserveFilter, consCtrl.addLpns, consCtrl.checkCompleteOrders],
  consCtrl.final
);

router.post("/signin", authCtrl.signin);

export default router;
