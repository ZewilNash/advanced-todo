let userDetailsDiv = document.querySelector(".user_details")
let addNoteBtn = document.querySelector("#add_note")
let noteInput = document.querySelector("#user_note")
let notesContainer = document.querySelector(".notes")
let noteForm = document.querySelector(".form")
let noteFormEdit = document.querySelector(".form-edit")
let editNoteBtn = document.querySelector("#edit_note")
let editNoteInput = document.querySelector("#edit_note_input")
let signOutBtn = document.querySelector("#signout")


let userData = JSON.parse(localStorage.getItem("user"))


signOutBtn.addEventListener("click" , (e) => {
    localStorage.removeItem("user")
    window.location.href = "/"
})


const removeChecked = async (note) => {
    let updatedNote = await axios.put(`/api/note/check/query?userId=${userData._id}&noteId=${note.id}` , {checked:false})
    note.style.textDecoration = "none"
}

const updateTaskComplete = async (note) => {
    let updatedNote = await axios.put(`/api/note/check/query?userId=${userData._id}&noteId=${note.id}` , {checked:true})
    note.style.textDecoration = "line-through"
}


const deleteNote = async (note) => {
    let msg = await axios.delete(`/api/note/delete/query?userId=${userData._id}&noteId=${note.id}`)
    console.log(msg)
    // window.location.href = "/note.html"
    let span = note.parentElement
    span.parentElement.remove()
}

const editNote = async (note) => {
    noteForm.classList.add("hide")
    noteFormEdit.classList.remove("hide")

    editNoteBtn.addEventListener("click", async (e) => {
        let inputValue = editNoteInput.value
        if (!inputValue) return

        let noteEl = await axios.put(`/api/note/update/query?userId=${userData._id}&noteId=${note.id}`, { newNote: inputValue })
        console.log(noteEl)
        let targetNote = noteEl.data.newNote.note

        let toolsDiv = note.parentElement
        let noteDiv = toolsDiv.parentElement

        noteDiv.querySelector("p").innerText = targetNote

        noteForm.classList.remove("hide")
        noteFormEdit.classList.add("hide")

    })
}


const loadAllUserNotes = async () => {
    let payload = {
        user: userData._id
    }
    let allNotes = await axios.post("/api/note/all", payload)
    let notes = allNotes.data.notes
    console.log(notes)

    /*
         <div class="note">
            <p id="note">Go to school</p>
            <div class="tools">
                <i class="fa-solid fa-pen-to-square edit"></i>
                <i class="fa-solid fa-trash delete"></i>
            </div>
        </div>
    */

    if (notes.length === 0) return

    notes.forEach(note => {
        let noteDiv = document.createElement("div")
        noteDiv.classList.add("note")
        noteDiv.innerHTML = `
        <p ondblclick="removeChecked(this)" style="text-decoration:${note.isChecked ? "line-through" : "none" }" id="${note._id}" onclick="updateTaskComplete(this)" >${note.note}</p>
        <div class="tools">
            <i id="${note._id}" onclick="editNote(this)" class="fa-solid fa-pen-to-square edit"></i>
            <i id="${note._id}" onclick="deleteNote(this)" class="fa-solid fa-trash delete"></i>
        </div>
        `

        notesContainer.appendChild(noteDiv)
    })
}

window.onload = () => {
    let user = JSON.parse(localStorage.getItem("user"))
    let { user_name, user_image } = user
    if (!user) {
        window.location.href = "/"
    }

    userDetailsDiv.innerHTML = `
            <img src="${user_image}" alt="">
            <span>${user_name}</span>
            <p>Fulfill your life with more achievements</p>
    `

    loadAllUserNotes()
}

addNoteBtn.addEventListener("click", async (e) => {
    let note = noteInput.value
    if (!note) return

    let payload = {
        note: note,
        user: userData._id
    }

    let noteData = await axios.post("/api/note/add", payload)

    let noteEl = noteData.data.note

    let noteDiv = document.createElement("div")
    noteDiv.classList.add("note")
    noteDiv.innerHTML = `
    <p ondblclick="removeChecked(this)" style="text-decoration:${note.isChecked ? "line-through" : "none" }" id="${note._id}" onclick="updateTaskComplete(this)">${noteEl.note}</p>
    <div class="tools">
        <i id="${noteEl._id}" onclick="editNote(this)" class="fa-solid fa-pen-to-square edit"></i>
        <i id="${noteEl._id}" onclick="deleteNote(this)" class="fa-solid fa-trash delete"></i>
    </div>
    `

    notesContainer.appendChild(noteDiv)

    console.log(noteData)

})