// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const attendanceSchema = new Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", 
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["present", "absent"],
//       required: true,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true } 
// );

// const Attendance = mongoose.model("Attendance", attendanceSchema);
// module.exports = Attendance;
