import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import transporter from "../config/emailConfig.js";

class UserController{

    //user Registration
    static userRegistration = async(req,res)=>{
        const {name, email, password, conf_password, tc} = await req.body;

        const user = await UserModel.findOne({email:email});

        if(user){
            res.send({"status":"failed", "message":"Email Id already exist"});
        }
        else{
            if(name && email && password && conf_password && tc)
            {
                if(password === conf_password){
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password,salt);
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        })
    
                        await doc.save();

                        //creating jwt token
                        const saved_user = await UserModel.findOne({email:email});
                        const token = JWT.sign({USER_ID : saved_user._id}, process.env.SECRET_KEY, {expiresIn : "5d"})

                        res.status(201).send({"status" : "Success", "message":"Registration Done!!", "token":token})
                        
                    } catch (error) {
                        res.send({"status":"failed", "message":"SOMETHING WENT WRONG"});
                    }
                    
                }
                else{
                    res.send({"status":"failed", "message":"Password doesn't match"});
                }
            }
            else{
                res.send({"status":"failed", "message":"Please fill all fields"});
            }
        }
    }

    //user Login
    static userLogin = async (req,res)=>{
        const {email,password} = req.body;

        try {
            if(email && password)
            {
                const user = await UserModel.findOne({email:email});

                if(user)
                {
                    const isMatch = await bcrypt.compare(password, user.password);

                    if((user.email === email) && isMatch)
                    {
                        //creating token
                        const token = JWT.sign({USER_ID:user._id}, process.env.SECRET_KEY, {expiresIn : '5d'});

                        res.send({"status":"success", "message":"Login Successfully", "token":token});
                    }
                    else{
                        res.send({"status":"failed", "message":"Either email or password is wrong"});
                    }
                }
                else{
                    res.send({"status":"Failed", "message":"Invalid User"});
                }

            }
            else{
                res.send({"status":"failed", "message":"All fields are requied"});
            }
            
        } catch (error) {
            console.log(error);
            res.send({"status":"failed", "message":"Unable to Login"});
        }
    }


    // updating password
    static updatePassword = async (req,res)=>{
        
        const {password, conf_password} = req.body;

        if(password && conf_password)
        {
            if(password === conf_password)
            {
                const salt = await bcrypt.genSalt(10);
                const newhashPassword = await bcrypt.hash(password,salt);

                // updating the password of the user
                await UserModel.findByIdAndUpdate(req.user._id, {$set: {password : newhashPassword}})

                res.send({"status":"Success", "message":"Password chnaged successfully !!"});
                
            }
            else{
                res.send({"status":"failed", "message":"Password didn't match"});
            }
        }
        else{
            res.send({"status":"failed", "message":"All fields are requied"});
        }
    }


    // showing the data of the authentic user
    static showUserData = async (req,res)=>{
        res.send({
            "User" : req.user
        });
    }

    // if user forget their password
    static sendUserPasswordResetLink = async (req,res)=>{
        const {email} = req.body;

        if(email)
        {
            try {
                const user = await UserModel.findOne({email:email});

                if(user)
                {
                    const secret = user._id + process.env.SECRET_KEY;
                    const token = await JWT.sign({USER_ID:user._id}, secret, {expiresIn:'5d'});

                    const link = `http://localhost:${process.env.PORT}/api/user/reset-password/${user._id}/${token}`;
                    console.log(link);

                    let info = await transporter.sendMail({
                        from : process.env.EMAIL_FROM,
                        to : user.email,
                        subject : "FOR CHANGING PASSWORD !!",
                        html : `<a href=${link}>Click here</a> to reset your password`
                    })

                    res.send({"status":"Success", "message":"Password Reset Link Has been send to your email id", "info":info});

                }
                else{
                    res.send({"status":"failed", "message":"Invalid user "});
                }
            } catch (error) {
                console.log(error);
            }
        }
        else{
            res.send({"status":"failed", "message":"Email is required !!"});
        }
    }

    //we will reset the password of the user
    static resetUserPassword = async (req,res)=>{
        const {password, conf_password} = req.body;
        const {id, token} = req.params

        const user = await UserModel.findById(id);

        // console.log(user);

        // console.log("Manisha");
        const new_secret = user._id + process.env.SECRET_KEY;

        try {
            JWT.verify(token,new_secret);

            if(password && conf_password)
            {
                if(password === conf_password)
                {
                    const salt = await bcrypt.genSalt(10);
                    const newhashPassword = await bcrypt.hash(password,salt);

                    // updating the password of the user
                    await UserModel.findByIdAndUpdate(user._id, {$set: {password : newhashPassword}})

                    res.send({"status":"Success", "message":"Password chnaged successfully !!"});

                }
                else{
                    res.send({"status":"failed", "message":"Password and Conf password doesn't match"});
                }
            }
            else{
                res.send({"status":"failed", "message":"All fields are required !!"});
            }
        } catch (error) {
            console.log(error);
            res.send({"status":"failed", "message":"Invalid user "});
        }
    }


}

export default UserController;