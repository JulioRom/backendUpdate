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

/**
 * @swagger
 * components:
 *  schemas:
 *    Conso:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *          description: Estado del proceso
 *      required:
 *        - message
 *      example:
 *        "message": "OK"
 */

/**
 *  @swagger
 *  /api/inProgress/{lpn}:
 *    get:
 *      summary: Ingresa lpn asociado a una Reserva
 *      tags: [Conso]
 *      parameters:
 *        - in: path
 *          name: lpn
 *          schema: 
 *            type: string
 *          required: true
 *          description: EL lpn asociado a una reserva
 *      responses:
 *        200: 
 *          description: OK
 *        404:
 *          description: "LPN_NOT_FOUND;SYSTEM_WITHOUT_EMPTY_SLOTS"
 */
router.all(
  "/:lpn",
  [consCtrl.reserveFilter, consCtrl.addLpns, consCtrl.checkCompleteOrders],
  consCtrl.final
);



export default router;
