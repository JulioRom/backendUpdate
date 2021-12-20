import { Router } from "express";
const router = Router();
import * as consCtrl from "../controllers/consolidador.core/consolidator.controller"

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



export default router;
