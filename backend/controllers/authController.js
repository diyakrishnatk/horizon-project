import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register=async(req,res)=>{
    try {
        //hashing password
        const salt=bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(req.body.password,salt);
      const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password:hash,
        photo:req.body.photo,
      })  
      await newUser.save();
      res
      .status(200)
      .json({
          success:true,
          message:"Successfully created",
         // data: savedTour,
      });
  } 
  catch (err) {
      res
      .status(500)
      .json({success:false,message:""});
  }
}

export const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!(email || username) || !password) {
      return res.status(400).json({ success: false, message: "Username/Email and password are required" });
    }

    const user = email ? await User.findOne({ email }) : await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ success: false, message: "Incorrect password" });

    const { password: pwd, ...rest } = user._doc;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });

    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ success: true, data: rest, role: user.role, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// import User from '../models/User.js'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'


// //user Registration
// export const register = async (req ,res) =>{
//     try{

//         const salt =bcrypt.genSaltSync(10);
//         const hash= bcrypt.hashSync(req.body.password,salt);

//         const newUser = new User({
//             username: req.body.username,
//             email:req.body.email,
//             password:hash,
//             photo:req.body.photo
//         })

//         await newUser.save()
//         res.status(200).json({
//             success:true,
//             message:'Successfully created'
//         })

//     }catch(err){
//         res.status(500).json({
//             success:false,
//             message:'Failed to create'
//         })
//     }
// };

// //user login

// export const login = async (req ,res) =>{

//     const email=req.body.email

//     try{
       
//         const user = await User.findOne({email})
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:'User Not Found'
//             })
//         }

//         const checkCorrectPassword= await bcrypt.compare(req.body.password, user.password)
//         if(!checkCorrectPassword){
//             return res.status(401).json({
//                 success:false,
//                 message:"Incorrect Email or password"
//             })
//         }

//         const {password,role, ...rest} = user._doc;

//         const token=jwt.sign(
//           {id: user._id, role:user.role},
//           process.env.JWT_SECRET_KEY,
//           {expiresIn :"15d"}

//         );

//         res.cookie("accessToken" , token,{
//             httpOnly:true,
//             expires: token.expiresIn,
//         })
//          .status(200)
//          .json({
//             token,
//             data: { ...rest },    
//             role,      
//          });
//     }
//     catch(err){
//        res.status(500).json({ success:false, message:"Failed to Login"});
//     }
// };
