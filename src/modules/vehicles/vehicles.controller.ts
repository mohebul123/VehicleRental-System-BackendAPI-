import { Request, Response} from "express";
import { vehiclesService } from "./vehicles.service";
const createVehicles = async(req:Request,res:Response)=>{
    try{
        const result = await vehiclesService.vehiclesCreate(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })

    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
const getAllVehicles = async(req:Request,res:Response)=>{
    try{
        const result = await vehiclesService.getAllVehicles();
      if(result.rows.length === 0){
         return res.status(200).json({
            success: true,
            message: "No vehicles found",
            data: result.rows
        })
      }
       return res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })

    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const getVehiclesById = async(req:Request,res:Response)=>{
    const id = req.params.vehicleId;
    try{
        const result = await vehiclesService.getVehiclesById(id as string);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        })

    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
const updateVehiclesById = async(req:Request,res:Response)=>{
    const id = req.params.vehicleId;
    try{
        const result = await vehiclesService.updateVehiclesById(id as string,req.body);
        res.status(200).json({
            success: true,
            message: "Vehicles updated successfully",
            data: result.rows[0]
        })

    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

const deleteVehiclesById = async(req:Request,res:Response)=>{
    const id = req.params.vehicleId;
    try{
        const result = await vehiclesService.deleteVehiclesById(id as string);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        })

    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

export const vehiclesController = {
    createVehicles,getAllVehicles,getVehiclesById,updateVehiclesById,deleteVehiclesById
}