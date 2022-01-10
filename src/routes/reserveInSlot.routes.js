import { Router } from "express";
const router = Router();

import * as reserveInSlot from "../controllers/consolidador.core/reserveInSlot.controller";

router
.route("/")
/**
 * @swagger
 * components:
 *  schemas:
 *    ReserveInSlot:
 *      type: object
 *      properties:
 *        reserve:
 *          type: string
 *          description: Reserva asociada a Slot
 *        slot:
 *          type: number
 *          description: ID del Slot
 *        lpnAssociates:
 *          type: array of strings
 *          description: lpns asociados a la reserva
 *      required:
 *        - reserve
 *        - lpnAssociates
 *        - slot
 *      example:
 *        reserve: "ABC4442"
 *        slot: 0
 *        lpnAssociates: 
 *          ["300400500600733331",
 *           "300400500600733332",
 *           "300400500600733333",
 *           "300400500600733334"]
 *    TakeOut:
 *      type: object
 *      properties:
 *        reserve:
 *          type: array of strings
 *          description: Reservas por extraer 
 *      required:
 *        - reserve
 *
 *      example:
 *          {
 *           reserves: ["ABC111","ABC222", "ABC333","ABC12345EXC" ,"ABC444","ABC555EXC"]
 *          }
 *    TakeOutput:
 *      type: object
 *      properties:
 *        takeOutON:
 *          type: array of strings
 *          description: Reservas encontradas
 *        reserveNotFound:
 *          type: array of strings
 *          description: Reservas no encontradas
 *      required:
 *        - takeOutON
 *        - reserveNotFound
 *
 *      example:
 *          reservesInSlots: {
 *              takeOutON: ["ABC111"],
 *              reserveNotFound: ["ABC222,ABC333,ABC12345EXC,ABC444,ABC555EXC"]
 *          }
 */

/**
 *  @swagger
 *  /api/reserveInSlot/:
 *    get:
 *      summary: Retorna todos los slots con reservas asociadas 
 *      tags: [ReserveInSlot]
 *      responses:
 *        200: 
 *          description: Lista de Slots ocupados
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/ReserveInSlot'
 *        404:
 *          description: Slots sin reservas asociadas
 */
.get(reserveInSlot.reserves)

/**
 *  @swagger
 *  /api/reserveInSlot/:
 *    put:
 *      summary: Enciende luz por slot para retirar lista de reservas indicadas
 *      tags: [ReserveInSlot]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/TakeOut'
 *      responses:
 *        200: 
 *          description: Lista de Reservas encontradas y no encontradas
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/TakeOutput'
 *        404:
 *          description: Necesitas al menos una reserva
 */
.put(reserveInSlot.slotsTakeOut);

export default router;
