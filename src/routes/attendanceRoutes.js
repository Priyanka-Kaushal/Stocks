import express from "express";
import {
  userAttendance,
  getAllAttendance,
  getAttendanceById,
  updateUserAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js";
const router = express.Router();

router.post("/userAttendance", userAttendance);
router.get("/attendance", getAllAttendance);
router.get("/indivualattendance/:id", getAttendanceById);
router.put("/attendanceUpdate/:id", updateUserAttendance);
router.delete("/attendanceDelete/:id", deleteAttendance);

export default router;
