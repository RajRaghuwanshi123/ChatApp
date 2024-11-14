import { Router } from "express";
import {
  signup,
  signin,
  getuserInfo,
  checksaveChanges,
  logout,
} from "../Controller/AuthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const authRoute = Router();

authRoute.post("/signup", signup);
authRoute.post("/signin", signin);
authRoute.get("/userInfo", verifyToken, getuserInfo);
authRoute.post("/saveChanges", verifyToken, checksaveChanges);
authRoute.post("/logOut", logout);
export default authRoute;
