const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
  },
  dueDate: {
    type: String,
  },
  tasks: [
    {
      status: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
      },
    },
  ],
  taskStatus: {
    type: String,
    default: "todo",
  },
  assignedTo: [
    {
      type: String, // Directly storing email strings
    },
  ],
  creatdBy: {
    type: String,
    required: true,
  },
  currentDate: {
    type: Date,
    default: Date.now, // Correctly setting the default value
  },
});

const noteModel = mongoose.model("Note", noteSchema); // Using "Note" as the model name
module.exports = noteModel;
