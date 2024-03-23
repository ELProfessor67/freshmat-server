import express from 'express';
import {config} from 'dotenv';
import path from 'path';
import routes from './router.js';
import { connectDB } from './config/database.js';
const __dirname = path.resolve();
import cors from 'cors';
import passport from 'passport';
import cookieParser from "cookie-parser";
import { connectPassportWithGoogleAuth } from './passport/googleProvider.js';
import session from "express-session";
import errorMiddleware from './middlewares/error.js'

config({path: path.join(__dirname,'./config/config.env')});
export const app = express();
connectDB();


app.use(cookieParser());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
  
      cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
      },
    })
  );
app.use(
    cors({
      credentials: true,
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use('',express.static(path.join(__dirname,'./public')));

// passport
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");
connectPassportWithGoogleAuth(passport);




//routes
app.use('/api/v1',routes)

app.use(errorMiddleware);
