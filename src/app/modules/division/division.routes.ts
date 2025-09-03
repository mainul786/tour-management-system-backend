import { Router } from "express";
import { divisionController } from "./division.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createDivisionZodSchmea } from "./division.validaion";

const router = Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDivisionZodSchmea),
  divisionController.createDivision
);
router.get("/", divisionController.getAllDivisions);
router.get("/:slug", divisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  divisionController.getSingleDivision
);

export const DivisionRouter = router;
