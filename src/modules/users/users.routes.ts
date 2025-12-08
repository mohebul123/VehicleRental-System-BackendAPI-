import { Router } from "express";
import { usersController } from "./users.controller";
import { auth } from "../../middlewares/auth.middleware";
const router = Router();
router.get('/',auth("admin"),usersController.getAllUser);
router.put('/:userId',auth("admin","customer"),usersController.updateUsersById);
router.delete('/:userId',auth("admin","customer"),usersController.deleteUsersById);
export const userRoutes = router;