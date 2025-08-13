/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVers } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done("user does not exists");
        }

        const isGoogleAuthenticated = isUserExist!.auths.some(
          (providerObject) => providerObject.provider == "google"
        );

        if (isGoogleAuthenticated && isUserExist.password) {
          return done(null, false, {
            message:
              "you have authenticated through Google. so if you want to login with credentials, than at first login with google and set a password for your gmail then you can login with email and password ",
          });
        }

        // if (!isGoogleAuthenticated && !isUserExist.password) {
        //   return done(
        //     "you have authenticated through Google. so if you want to login with credentials, than at first login with google and set a password for your gmail then you can login with email and password "
        //   );
        // }

        const isMatchedPassword = bcryptjs.compare(
          password as string,
          isUserExist!.password as string
        );
        if (!isMatchedPassword) {
          done(null, false, { message: "wrong password" });
        }
        return done(null, isUserExist.toObject());
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVers.GOOGLE_CLIENT_ID,
      clientSecret: envVers.GOOGLE_CLIENT_SECRET,
      callbackURL: envVers.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found" });
        }
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            isDeleted: false,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Google strategy error", error);
        return error;
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(null, error);
  }
});
