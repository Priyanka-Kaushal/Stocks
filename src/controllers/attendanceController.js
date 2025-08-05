const Attendance = require("../models/attendanceSchema.js");
// const User = require("../models/userModel");

const userAttendance = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "userId and status are required." });
    }

    const attendance = new Attendance({
      userId,
      status,
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully.",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const allAttendance = await Attendance.find();
    // const allAttendance = await Attendance.find().populate("userId");
    res.status(200).json({
      success: true,
      data: allAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({
        success: false,
        message: "User's attendance not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: updatedAttendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!deletedAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  userAttendance,
  getAllAttendance,
  updateAttendance,
  deleteAttendance,
};
