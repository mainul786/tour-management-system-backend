import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/register", userControllers.createUser);
router.get("/all-user", userControllers.allUser);

export const UserRoutes = router;
