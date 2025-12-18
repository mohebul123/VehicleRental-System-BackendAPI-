import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";
import { auth } from "../../middlewares/auth.middleware";


const router = Router();

router.post('/',auth("admin"),vehiclesController.createVehicles);
router.get('/',vehiclesController.getAllVehicles);
router.get('/:vehicleId',vehiclesController.getVehiclesById);
router.put('/:vehicleId',auth("admin"),vehiclesController.updateVehiclesById);
router.delete('/:vehicleId',auth("admin"),vehiclesController.deleteVehiclesById);

export const vehiclesRoutes = router;