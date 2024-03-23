import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.js";

export const connectPassportWithGoogleAuth = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        
        const user = await UserModel.findOne({
          googleId: profile.id,
        });

        if (!user) {
          const newUser = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            avtar: {
              url: profile.photos[0].value,
              public_id: undefined
            },
            
            email: profile._json.email
          });

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    
    const user = await UserModel.findById(id);
    done(null, user);
  });
};