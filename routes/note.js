const express = require("express")
const {addNote , getUserNotes , deleteNote , updateUserNote , updateTaskComplete} = require("../controller/note")
const router = express.Router()


router.post("/add" , addNote)
router.post("/all" , getUserNotes)
router.delete("/delete/query" , deleteNote)
router.put("/update/query" , updateUserNote)
router.put("/check/query" , updateTaskComplete)


module.exports = router