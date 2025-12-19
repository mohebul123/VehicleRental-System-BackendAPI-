import { Request, Response} from "express";
import { usersService } from "./users.service";
import { JwtPayload } from "jsonwebtoken";

const getAllUser = async(req:Request,res:Response)=>{
    try{
        const result = await usersService.getAllUsers();
      if(result.rows.length === 0){
          res.status(200).json({
            success: true,
            message: "No Users Found",
            data: result.rows
        })
      }
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}
const updateUsersById= async(req:Request,res:Response)=>{
    const id = req.params.userId;
    try{
        const result = await usersService.updateUsersById(id as string,req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result
        })
    }catch(error:any){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
const deleteUsersById =  async (req: Request, res: Response) => {
    const id = req.params.userId; 
    const user_role = req.user!.role ;
    if(user_role === 'customer')
        throw new Error("you are not authorized to delete others USERS ID")
    
    try {
        const result = await usersService.deleteUsersById(id as string);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
export const usersController = {
   getAllUser,updateUsersById,deleteUsersById
}