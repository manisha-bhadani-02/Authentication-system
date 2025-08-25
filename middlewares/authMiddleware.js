import JWT from 'jsonwebtoken';
import UserModel from '../models/User.js';
  
const checkUserAuth = async (req, res, next)=>{
    let token
    const {authorization} = req.headers

    if(authorization && authorization.startsWith('Bearer'))
    {
        try {
            //get token from header
            token = authorization.split(' ')[1];

            //verify token
            const {USER_ID} = JWT.verify(token, process.env.SECRET_KEY);

            //get user from token
            req.user = await UserModel.findById(USER_ID).select('-password')

            // console.log(req.user);

            next();
        } catch (error) {
            console.log(error);
            res.send({"status":"failed", "message":"Unauthorized User"});
        }
    }
    
    if(!token)
    {
        res.status(401).send({"status":"failed", "message":"No Token Received"});
    }

}

export default checkUserAuth;