import { Router } from "express";
const router = Router();

import * as Slots from "../controllers/consolidador.core/Slots.controller";
//Filter slot data from db to show in front

/**
 * @swagger
 * components:
 *  schemas:
 *    Slot:
 *      type: object
 *      properties:
 *        slotId:
 *          type: number
 *          description: ID del slot
 *        reserve:
 *          type: string
 *          description: ID de la Reserva asociada al Slot
 *        lpns:
 *          type: array of strings
 *          description: lpns asociados a la Reserva
 *      required:
 *        - slotId
 *        - reserve
 *        - lpns
 *      example:
 *        slotId: 0
 *        reserve: "ABC111"
 *        lpns: 
 *          ["300400500600733331",
 *           "300400500600733332",
 *           "300400500600733333",
 *           "300400500600733334"]
 */

/**
 *  @swagger
 *  /api/slotInfo/:
 *    get:
 *      summary: Retorna el Estado de todos los Slots
 *      tags: [Slot]
 *      responses:
 *        200: 
 *          description: Todos los slots
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Slot'
 */
router.get("/", Slots.slots);

/**
 *  @swagger
 *  /api/slotInfo/{reserva}:
 *    get:
 *      summary: Retorna el Estado de todos los Slots
 *      tags: [Slot]
 *      parameters:
 *        - in: path
 *          name: reserva
 *          schema: 
 *            type: string
 *          required: true
 *          description: La Reserva Asociada al Slot
 *      responses:
 *        200: 
 *          description: Slot asociado a la Reserva
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Slot'
 */
router.get("/:reserve", Slots.findReserve);

export default router;
