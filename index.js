import express from "express"
import "dotenv/config.js"
import session from "express-session"
import morgan from "morgan"
import pathHandler from "./src/middlewares/pathHandler.mid.js"
import errorHandler from "./src/middlewares/errorHandler.mid.js"
import indexRouter from "./src/routers/index.router.js"
import dbConnect from "./src/utils/dbConnect.js"
import cookieParser from "cookie-parser"

//server
const server = express()
const port = process.env.PORT
const ready = ()=> {
    console.log ("server listo en puerto "+ port);
    dbConnect()
} 
server.listen(port,ready)

//middlewares
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(morgan("dev"))
server.use(cookieParser(process.env.SECRET_KEY))
server.use(session({
    secret: "process.env.SECRET_KEY",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))

//routers
server.use(indexRouter)
server.use(errorHandler)
server.use(pathHandler)