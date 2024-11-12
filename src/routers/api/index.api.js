import { Router } from "express";
import productsApiRouter from "./products.api.js";
import cookiesRouter from "./cookies.api.js";

const apiRouter = Router()

apiRouter.use("/products", productsApiRouter)
apiRouter.use("/cookies",cookiesRouter)

export default apiRouter