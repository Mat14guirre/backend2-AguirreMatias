import passport from "passport";
import { Strategy as LocalStrategy} from "passport-local";
import { Strategy as GoogleStrategy} from "passport-google-oauth2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { create,readByEmail } from "../data/mongo/managers/users.manager.js";
import { createHashUtil } from "../utils/hash.util.js";
import { verifyHashUtil } from "../utils/hash.util.js";
import {createTokenUtil} from "../utils/token.util.js"

const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET, BASE_URL} = process.env


passport.use(
    "register",
     new LocalStrategy(
    {passReqToCallback:true, usernameField: "email" },
    async(req, email , password, done)=> {
        try{
            if(!email || !password){

            }
            const one = await readByEmail(email)
            if (one) {
                const error = new Error("EL USUARIO YA EXISTE")
                error.statusCode = 400
                return done (error)
            }
            req.body.password = createHashUtil (password)
            const data = req.body
            const user= await create(data)
            return done (null, user)
            
        }catch (error){
            return done (error)
        }
        
        
    }
))

passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await readByEmail(email);
          if (!user) {
            const info = { message: "USER NOT FOUND", statusCode: 401 };
            return done(null, false, info);
          }
          const passwordForm = password; /* req.body.password */
          const passwordDb = user.password;
          const verify = verifyHashUtil(passwordForm, passwordDb);
          if (!verify) {
            const info = { message: "CREDENCIAL INVALIDA", statusCode: 401 };
            return done(null, false, info);
          }
          const data = {
            user_id: user._id,
            role: user.role,
          };
          const token = createTokenUtil(data);
          user.token = token;
          await update(user._id, { isOnline: true });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use(
    "admin",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (data, done) => {
        try {
          const { user_id, role } = data;
          if (role !== "ADMIN") {
            const info = { message: "No autorizado", statusCode: 403 };
            return done(null, false, info);
          }
          const user = await readById(user_id);
          return done(null, user);
        } catch (error) {}
      }
    )
  );
passport.use(
    "online",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (data, done) => {
        try {
          const { user_id } = data;
          const user = await readById(user_id);
          const { isOnline } = user;
          if (!isOnline) {
            const info = { message: "USUARIO DESCONECTADO", statusCode: 401 };
            return done(null, false, info);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
passport.use(
    "signout",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
        secretOrKey: process.env.SECRET_KEY,
      },
      async (data, done) => {
        try {
          const { user_id } = data;
          await update(user_id, { isOnline: false });
          return done(null, { user_id: null });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

passport.use (
    "google",
     new GoogleStrategy(
    {clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, passReqToCallback : true, callbackURL: BASE_URL +"sessions/google/cb"},
    async(req,accesToken, refreshToken, profile, done) =>{
        try{
            
            const {id,picture} = profile
            let user = await readByEmail(id)
            if (!user){
                user = await create({email: id, photo: picture, password: createHashUtil(id) })
            }
            req.token= createTokenUtil ({role:user.role, user: user._id})
            return done(null, user)
        }catch (error){
            return done(error)
        }
    }
))

export default passport