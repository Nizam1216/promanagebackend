const noteModel = require("../models/NoteModel");
const userModel = require("../models/UserModel");

const getDateRangeFilter = (dateRange) => {
  const now = new Date();
  let startDate;

  if (dateRange === "day") {
    startDate = new Date(now.setHours(0, 0, 0, 0));
  } else if (dateRange === "week") {
    startDate = new Date(now.setDate(now.getDate() - 6));
  } else if (dateRange === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { currentDate: { $gte: startDate } };
};

exports.createNoteCtrl = async (req, res) => {
  const { title, priority, dueDate, tasks, taskStatus, assignedTo } = req.body;
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId).select("email");
    await noteModel.create({
      title,
      priority,
      dueDate,
      tasks,
      taskStatus,
      assignedTo,
      creatdBy: user.email,
    });
    res.json({ message: "New note created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while creating a note" });
  }
};

exports.getNotesCtrl = async (req, res) => {
  const userId = req.user.id;
  const { dateRange } = req.body;
  try {
    const user = await userModel.findById(userId).select("email");

    const dateFilter = getDateRangeFilter(dateRange);

    const userNotes = await noteModel.find({
      $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
      ...dateFilter,
    });

    res.json({ userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching notes" });
  }
};

exports.getOneNoteCtrl = async (req, res) => {
  const noteId = req.params.id;
  try {
    const oneNote = await noteModel.findById(noteId);
    res.json({ message: "Note fetched successfully", oneNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching one note" });
  }
};

exports.getNoteAnalyticsCtrl = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId).select("email");

    const analytics = await noteModel.aggregate([
      {
        $match: {
          $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
        },
      },
      {
        $group: {
          _id: null,
          backlogTasks: {
            $sum: { $cond: [{ $eq: ["$taskStatus", "backlog"] }, 1, 0] },
          },
          todoTasks: {
            $sum: { $cond: [{ $eq: ["$taskStatus", "todo"] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$taskStatus", "progress"] }, 1, 0] },
          },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$taskStatus", "done"] }, 1, 0] },
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] },
          },
          moderatePriority: {
            $sum: { $cond: [{ $eq: ["$priority", "moderate"] }, 1, 0] },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
          dueDateTasks: {
            $sum: {
              $cond: [{ $gte: ["$dueDate", new Date().toISOString()] }, 1, 0],
            },
          },
        },
      },
    ]);

    const result = analytics[0] || {};

    const analyticsData = {
      backlogTasks: result.backlogTasks || 0,
      todoTasks: result.todoTasks || 0,
      inProgressTasks: result.inProgressTasks || 0,
      completedTasks: result.completedTasks || 0,
      lowPriority: result.lowPriority || 0,
      moderatePriority: result.moderatePriority || 0,
      highPriority: result.highPriority || 0,
      dueDateTasks: result.dueDateTasks || 0,
    };

    res.json({ message: "Analytics fetched successfully", analyticsData });
  } catch (error) {
    console.error("Error fetching note analytics:", error);
    res.status(500).json({ message: "Error fetching note analytics" });
  }
};

exports.getTodoNotesCtrl = async (req, res) => {
  const userId = req.user.id;
  const { dateRange } = req.body;
  try {
    const user = await userModel.findById(userId).select("email");

    const dateFilter = getDateRangeFilter(dateRange);

    const userNotes = await noteModel.find({
      $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
      taskStatus: "todo",
      ...dateFilter,
    });

    res.json({ userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching todo notes" });
  }
};

exports.getInProcessNotesCtrl = async (req, res) => {
  const userId = req.user.id;
  const { dateRange } = req.body;
  try {
    const user = await userModel.findById(userId).select("email");

    const dateFilter = getDateRangeFilter(dateRange);

    const userNotes = await noteModel.find({
      $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
      taskStatus: "progress",
      ...dateFilter,
    });

    res.json({ userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching in-progress notes" });
  }
};

exports.getDoneNotesCtrl = async (req, res) => {
  const userId = req.user.id;
  const { dateRange } = req.body;
  try {
    const user = await userModel.findById(userId).select("email");

    const dateFilter = getDateRangeFilter(dateRange);

    const userNotes = await noteModel.find({
      $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
      taskStatus: "done",
      ...dateFilter,
    });

    res.json({ userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching done notes" });
  }
};

exports.getBacklogNotesCtrl = async (req, res) => {
  const userId = req.user.id;
  const { dateRange } = req.body;
  try {
    const user = await userModel.findById(userId).select("email");

    const dateFilter = getDateRangeFilter(dateRange);

    const userNotes = await noteModel.find({
      $or: [{ assignedTo: user.email }, { creatdBy: user.email }],
      taskStatus: "backlog",
      ...dateFilter,
    });

    res.json({ userNotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while fetching backlog notes" });
  }
};

exports.deleteNoteCtrl = async (req, res) => {
  const noteId = req.params.id; // Assuming the note ID is passed as a route parameter

  try {
    const deletedNote = await noteModel.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note" });
  }
};

exports.editNoteCtrl = async (req, res) => {
  const noteId = req.params.id; // Assuming the note ID is passed as a route parameter
  const { title, priority, dueDate, tasks, taskStatus, assignedTo } = req.body;

  try {
    const updatedNote = await noteModel.findByIdAndUpdate(
      noteId,
      { title, priority, dueDate, tasks, taskStatus, assignedTo },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note updated successfully", updatedNote });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note" });
  }
};
