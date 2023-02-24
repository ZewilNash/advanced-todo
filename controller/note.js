
const Note = require("../model/note")
const User = require("../model/user")

const addNote = async (req , res) => {
    let {note , user} = req.body

    if(!note || !user){
        return res.status(200).json({error:"Note is required"})
    }

  
    let newNote = {
        note:note,
        user:user
    }

    let userNote = await Note(newNote)

    await userNote.save()

    // console.log(userNote._id)

    // let targetUser = await User.findById(user)

    // targetUser.notes.push(userNote._id)
    // console.log(targetUser)


    res.status(200).json({success:true , note:userNote})
}


const getUserNotes = async (req , res) => {
    let {user} = req.body

    if(!user){
        return res.status(200).json({success:false , error:"Provide a user"})
    }

    let allUserNotes = await Note.find({user:user})

    console.log(allUserNotes)

    res.status(200).json({success:true , notes:allUserNotes})
}


const deleteNote = async (req , res) => {
    let {userId , noteId} = req.query
    if(!userId  || !noteId){
        return res.status(200).json({success:false , error:"Please Provide ids"})
    }

    let deletedNote = await Note.findOneAndDelete({user:userId , _id:noteId})

    res.status(200).json({success:true , msg:"Note has been deleted succesfully"})
}

const updateUserNote =  async (req , res) => {
    let {userId , noteId} = req.query
    let {newNote} = req.body
    if(!userId  || !noteId){
        return res.status(200).json({success:false , error:"Please Provide ids"})
    }

    let updatedNote = await Note.findOneAndUpdate({user:userId , _id:noteId} , {note:newNote} , {new:true})

    res.status(200).json({success:true , msg:"Note updated Succesfully" , newNote:updatedNote})
}

const updateTaskComplete = async (req , res) => {
    let {userId , noteId} = req.query
    let {checked} = req.body

    if(!userId  || !noteId){
        return res.status(200).json({success:false , error:"Please Provide ids"})
    }

    let updatedNote = await Note.findOneAndUpdate({user:userId , _id:noteId} , {isChecked:checked} , {new:true})
    res.status(200).json({success:true , msg:"Note updated Succesfully" , newNote:updatedNote})
}


module.exports = {addNote , getUserNotes , deleteNote , updateUserNote ,updateTaskComplete}