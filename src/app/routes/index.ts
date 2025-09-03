import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";
import { DivisionRouter } from "../modules/division/division.routes";
import { TourRoutes } from "../modules/tour/tour.routes";
export const router = express.Router();
export const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/division",
    route: DivisionRouter,
  },
  {
    path: "/tour",
    route: TourRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
