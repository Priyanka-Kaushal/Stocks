const express = require("express");
const router = express.Router();

const {
  userAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

router.post("/userAttendance", userAttendance); 


router.get("/attendance", getAllAttendance);

router.get("/indivualattendance/:id", getAttendanceById);

router.put("/attendanceUpdate/:id", updateAttendance);

router.delete("/attendanceDelete/:id", deleteAttendance);

module.exports = router;
