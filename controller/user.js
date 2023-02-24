const User = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

/*
	"email":"sam_400@kamal.com",
    "password":"Iloveallah!1997"
    
*/


const createAccount = async (req, res) => {
    try {

        let { first_name, last_name, password, email, user_image } = req.body
        let hash = await bcrypt.hash(password, 10);

        let user_name = `${first_name}-${new Date().getSeconds()}-${last_name}`

        let newUser = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hash,
            user_image: user_image,
            user_name: user_name,
        }

        let userData = await User(newUser)

        const token = jwt.sign(
            { user_id: userData._id, email },
            process.env.WEB_TOKEN_SECRET,
            {
                expiresIn: "2h"
            }
        )

        userData.token = token
        await userData.save()

        res.status(200).json({ success: true, msg: "User created Successfully", user: userData })

        // let {
        //     first_name , last_name , email , password,
        //     user_image , confirm_pass
        // } = req.body

        // let duplicatedUserWithSameEmail = await User.find({email:email})


        // let stringRegx = /^[a-zA-Z]+$/
        // let emailRegx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
        // let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
        // let imageRegex = "[^\\s]+(.*?)\\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$"

        // let error = {}

        // if(!first_name || !last_name || !email || !password || !confirm_pass){
        //     error.empty = "Fill the Required Fields"
        // }

        // if(!first_name.match(stringRegx) || !last_name.match(stringRegx) || first_name.length < 3 || last_name.length < 3){
        //     error.name = "Provaide a valid Firstname / Lastname"
        // }

        // if(!email.match(emailRegx)){
        //     error.email = "Provaide a valid Email"
        // }

        // if(duplicatedUserWithSameEmail.length > 0){
        //     error.duplicatedEmail = "This Email Has Been Taken"
        // }

        // if(!password.match(passwordRegex)){
        //     error.password = "Provaide a valid Password"
        // }

        // if(!(password === confirm_pass)){
        //     error.confirmPass = "Password and confirm password should match"
        // }



        // if(Object.keys(error).length === 0){
        //     let randomUserImages = [
        //     "https://img.icons8.com/plasticine/256/reading-unicorn.png" , 
        //     "https://img.icons8.com/color/256/unicorn.png",
        //     "https://img.icons8.com/clouds/256/unicorn.png",
        //     "https://img.icons8.com/nolan/256/unicorn.png",
        //     "https://img.icons8.com/plasticine/256/peacock.png",
        //     "https://img.icons8.com/plasticine/256/narwhal.png",
        //     "https://img.icons8.com/plasticine/256/scarab.png",
        //     "https://img.icons8.com/plasticine/256/ladybird.png",
        //     "https://img.icons8.com/plasticine/256/stork-with-bundle.png",
        //     "https://img.icons8.com/plasticine/256/wombat.png",
        //     "https://img.icons8.com/plasticine/256/sheep2.png",
        //     "https://img.icons8.com/plasticine/256/german-shepherd.png",
        //     "https://img.icons8.com/plasticine/256/kangaroo.png"
        // ]


        //     let hash = await bcrypt.hash(password , 10).then((hash) => hash)
        //     console.log(hash)


        //    let newUser = {
        //         first_name:first_name,
        //         last_name:last_name,
        //         email:email,
        //         password:hash,
        //         user_image: user_image !== "" && user_image.match(imageRegex) ? user_image : randomUserImages[Math.floor(Math.random() * randomUserImages.length)] ,
        //         user_name:user_name,
        //     }



        //     let userData = await User(newUser)

        //     const token = jwt.sign(
        //         {user_id:userData._id , email},
        //         process.env.WEB_TOKEN_SECRET,
        //         {
        //             expiresIn:"2h"
        //         }
        //     )

        //     userData.token = token

        //     await userData.save()


        //     res.status(200).json({success:true , msg:"User created Successfully" , user:userData})

        // }else {
        //     res.status(200).json({error:error})
        // }

    } catch (error) {
        res.status(400).json({ error });
    }


}

const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let userWithEmail = await User.findOne({ email: email })

        if (userWithEmail) {
            const result = await bcrypt.compare(password, userWithEmail.password)
            if (result) {
                const token = jwt.sign(
                    { user_id: userWithEmail._id, email },
                    process.env.WEB_TOKEN_SECRET,
                    { expiresIn: "2h" }
                )

                userWithEmail.token = token
                res.status(200).json({ success: true, msg: "You Logged In Successfully", user: userWithEmail })

            } else {
                res.status(400).json({ error: "password doesn't match" })
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }

    } catch (err) {
        res.status(400).json({ error });
    }
    // let {email , password} = req.body
    // let userWithEmail = await User.findOne({email:email})

    // if(!email || !password){
    //     error.empty = "All inputs are required"
    // }

    // if(!userWithEmail){
    //     error.notFound = "There is no user with this email"
    // }

    // if(!(await bcrypt.compare(password , userWithEmail.password))){
    //     error.notMatch = "You may have entered a wrong password"
    // }

    // if(userWithEmail && (await bcrypt.compare(password , userWithEmail.password)) && Object.keys(error).length === 0){
    //     const token = jwt.sign(
    //         {user_id:userWithEmail._id , email},
    //         process.env.WEB_TOKEN_SECRET,
    //         {expiresIn:"2h"}
    //     )

    //     userWithEmail.token = token

    //     res.status(200).json({success:true , msg:"You Logged In Successfully" , user:userWithEmail})
    // }else {
    //     res.status(400).json({success:false , error:error})
    // }


}


const forgetPass = async (req, res) => {
    try {

        const { email } = req.body
        let user = await User.findOne({ email })

        if (user) {
            //logic go here
            return res.status(200).json({ verified: true, email: email })
        } else {
            return res.status(400).json({ error: "User With this email not found" })
        }

    } catch (err) {
        res.status(400).json({ err })
    }


}


const resetPass = async (req, res) => {


        let { new_pass, email } = req.body
        console.log(new_pass , email)
        let hashedNewPass = await bcrypt.hash(new_pass, 10)

        let databaseUser = await User.findOneAndUpdate({email} , {password:hashedNewPass} , {new:true})
        console.log(databaseUser)

        res.status(200).json({success:true , msg:"Password reset Succesfully" , newUser:databaseUser})

    
}


module.exports = { createAccount, login, forgetPass, resetPass }