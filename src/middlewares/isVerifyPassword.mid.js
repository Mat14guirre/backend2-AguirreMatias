import { readByEmail } from "../data/mongo/managers/users.manager.js"

async function isVerifyPassword(req, res, next) {
    try {
        const { email, password } = req.body
        const one = await readByEmail(email)
        
        if (one) {
            
            const verify = password === one.password
            if (verify) {
                return next()
            }
        }
        const message = "CONTRASEÑA INCORRECTA"
        return res.status(401).json({ message })
    } catch (error) {
        return next(error)
    }
}

export default isVerifyPassword