const express = require("express")
const {createAccount , login , forgetPass , resetPass} = require("../controller/user")
const router = express.Router()

router.post("/signup" , createAccount)
router.post("/login" , login)
router.post("/forgetpass" , forgetPass)
router.put("/resetpass" , resetPass)




module.exports = router