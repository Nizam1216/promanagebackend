const express = require("express");
const currentUser = require("./middleware/currentUser");
const {
  getNotesCtrl,
  getTodoNotesCtrl,
  editNoteCtrl,
  deleteNoteCtrl,
  getInProcessNotesCtrl,
  getDoneNotesCtrl,
  getBacklogNotesCtrl,
  createNoteCtrl,
  getOneNoteCtrl,
  getNoteAnalyticsCtrl,
} = require("../controllers/notecontrollers");

const router = express.Router();

router.post("/create-note", currentUser, createNoteCtrl);
router.post("/get-notes", currentUser, getNotesCtrl);
router.post("/get-todo-notes", currentUser, getTodoNotesCtrl);
router.post("/get-in-progress-notes", currentUser, getInProcessNotesCtrl);
router.post("/get-done-notes", currentUser, getDoneNotesCtrl);
router.post("/get-backlog-notes", currentUser, getBacklogNotesCtrl);
router.get("/get-one-note/:id", getOneNoteCtrl);

router.post("/edit-note/:id", currentUser, editNoteCtrl);
router.delete("/delete-note/:id", currentUser, deleteNoteCtrl);

router.post("/analytics", currentUser, getNoteAnalyticsCtrl);

module.exports = router;
