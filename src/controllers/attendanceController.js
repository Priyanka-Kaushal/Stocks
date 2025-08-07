const Attendance = require("../models/attendanceSchema.js");
// const User = require("../models/userModel");

const userAttendance = async (req, res) => {
  try {
    const { userId, status, date } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId and status are required.",
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'present' or 'absent'.",
      });
    }

    const inputDate = date ? new Date(date) : new Date();

    
    const normalizedDate = new Date(
      inputDate.getFullYear(),
      inputDate.getMonth(),
      inputDate.getDate()
    );

    const existingRecord = await Attendance.findOne({
      userId,
      date: normalizedDate,
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date.",
      });
    }

    const attendance = new Attendance({
      userId,
      status,
      date: normalizedDate,
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

const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance retrieved successfully.",
      data: attendance,
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
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};
