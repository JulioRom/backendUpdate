import { Router } from "express";
const router = Router();

import * as productsCtrl from "../controllers/products.controller";
import { authJwt, nonDuplicate } from "../middlewares";


/**
 *  @swagger
 *  /api/products:
 *    get:
 *      summary: Retorna todos los Productos/Reserva 
 *      tags: [Product]
 *      responses:
 *        200: 
 *          description: Todos los productos en la coleccion mongo
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                $ref: '#/components/schemas/Product'
 */
router.get("/", productsCtrl.getProducts);

/**
 *  @swagger
 *  /api/products/{id}:
 *    get:
 *      summary: Retorna un Producto/Reserva 
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: La id del producto
 *      responses:
 *        200: 
 *          description: Producto solicitado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: Producto no encontrado
 */
router.get("/:productId", productsCtrl.getProductById);


/**
 * @swagger
 * components:
 *  schemas:
 *    Product:
 *      type: object
 *      properties:
 *        reserve:
 *          type: string
 *          description: Reserva asociada a lpns
 *        lpnAssociates:
 *          type: array of strings
 *          description: lpns asociados a la reserva
 *        reserveStatus:
 *          type: string
 *          description: estado de la reserva
 *      required:
 *        - reserve
 *        - lpnAssociates
 *        - reserveStatus
 *      example:
 *        reserve: "ABC4442"
 *        lpnAssociates: 
 *          ["300400500600733331",
 *           "300400500600733332",
 *           "300400500600733333",
 *           "300400500600733334"]
 *        reserveStatus: "created"
 */

/**
 *  @swagger
 *  /api/products:
 *    post:
 *      summary: Crea un nuevo Producto/Reserva 
 *      tags: [Product]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product'
 *      responses:
 *        200: 
 *          description: Un objeto Product + mongo ID + timeStamps
 */

router.post(
  "/",
  [nonDuplicate.checkDuplicateReserve, nonDuplicate.checkLpn],
  productsCtrl.createProduct
);

/**
 *  @swagger
 *  /api/products/{id}:
 *    put:
 *      summary: Actualiza los datos de un Producto/Reserva 
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: La id del producto
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Product'
 *      responses:
 *        200: 
 *          description: Producto solicitado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: Producto no encontrado
 */
router.put(
  "/:productId",
  [nonDuplicate.checkDuplicateReserve],
  productsCtrl.updateProductById
);

/**
 *  @swagger
 *  /api/products/{id}:
 *    delete:
 *      summary: Elimina un Producto/Reserva 
 *      tags: [Product]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *            type: string
 *          required: true
 *          description: La id del producto
 *      responses:
 *        200: 
 *          description: Producto solicitado eliminado
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Product'
 *        404:
 *          description: Producto no encontrado
 */
router.delete(
  "/:productId",
  productsCtrl.deleteProductById
);

export default router;
