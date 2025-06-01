import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';    //this library is used to hash a password
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import { errorHandler } from "../utils/error.js";

const signup = async (req,res,next)=>{

    const {username,email ,password} = req.body;  

    if(!username || !email || !password || username === '' || email===''|| password === ''){
      // return res.status(400).json({message:'all fields are required'})

      next(errorHandler(400 , 'all fields are required'));
    }

    const hashpassword = bcryptjs.hashSync(password,10)   //here is the implementation for hashing a password
     
    const newUser = new User({
        username,
        email,
        password:hashpassword
    })

    try{
        await newUser.save();
        res.json("signup succefull");
    }
    catch(error)
    {
       // res.status(500).json({message:error.message})
       next(error);
    }

    
}


const signin = async (req,res,next)=>{
       
    const {email,password} = req.body;


    if(!email || !password || email==="" || password===""){
        next(errorHandler(400,"All fields are required"));
    }

    try{
        const validUser = await User.findOne({email});
        
        if(!validUser)
            {
               return next(errorHandler(400, "user not found"));
            }

        const validpassword = bcryptjs.compareSync(password , validUser.password);
         
        if(!validpassword)
            {
               return next(errorHandler(400,"incorrect password"))
            }

            // console.log(validUser)
            const {password:pass , ...rest} = validUser._doc;
       
            const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.jwt_secret);

            res.status(200).cookie('access_token' , token , {http:true}).json(rest);

    }
    catch(error){
        next(error)
    }
      
}

const  forgotPassword = async (req,res,next)=>{
  try{
        const {email} = req.body;

        const validUser =await User.findOne({email});

        if(!validUser){
          next(errorHandler(400,"user is not valid"));
        }
     
        const token = jwt.sign({id:validUser._id},process.env.jwt_secret);

        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'umarfarooqbcs@gmail.com',
            pass: 'ojqo mqnq wknv qeat'
          }
        });
        
        var mailOptions = {
          from: 'umarfarooqbcs@gmail.com',
          to: email,
          subject: 'reset-password',
          text: `http://localhost:5173/resetPassword/${validUser._id}/${token}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        }); 

    res.json("reset successful")
  }
  catch(error){
      next(error)
  }
}
const resetPassword = async (req,res,next)=>{
  try{
      const {userId,token} = req.params;
      const {password} = req.body;

      jwt.verify(token, process.env.jwt_secret , async (err , user)=>{
          if(err){
              return next(errorHandler(401 , "unauthorized"));
          }
          else{
              const hashpassword = bcryptjs.hashSync(password,10) 

              const updatedPasswrod = await User.findByIdAndUpdate(userId , {password:hashpassword});

              if(!updatedPasswrod){
                  return next(errorHandler(400, "error in updating password"));
              }

              res.status(200).json("password updated successfully");
          

          }
          
      })
  }
  catch(error){
      next(error)
  }
}

// const resetPassword = async (req, res, next) => {
//     try {
//       const { userId, token } = req.params;
//       const { password } = req.body;
  
//       jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
//         if (err) {
//           return next(errorHandler(401, "Unauthorized"));
//         } else {
//           const hashPassword = bcryptjs.hashSync(password, 10);
//           const updatedPassword = await User.findByIdAndUpdate(userId, { password: hashPassword });
  
//           if (!updatedPassword) {
//             return next(errorHandler(400, "Error in updating password"));
//           }
  
//           res.status(200).json("Password updated successfully");
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
  


  
//   const forgotPassword = async (req, res, next) => {
//     try {
//       const { email } = req.body;
//       const validUser = await User.findOne({ email });
  
//       if (!validUser) {
//         return next(errorHandler(400, "User is not valid"));
//       }
  
//       const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
//       var transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'umarfarooqbcs@gmail.com',
//           pass: 'ojqo mqnq wknv qeat'
//         }
//       });
  
//       var mailOptions = {
//         from: 'umarfarooqbcs@gmail.com',
//         to: email,
//         subject: 'Reset Password',
//         text: `Please click the following link to reset your password: http://localhost:5173/resetPassword/${validUser._id}/${token}`
//       };
  
//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//           return next(errorHandler(500, "Email sending failed"));
//         } else {
//           console.log('Email sent: ' + info.response);
//           res.json("Reset email sent successfully");
//         }
//       });
//     } catch (error) {
//       next(error);
//     }
//   };
  



// const  forgotPassword = async (req,res,next)=>{
//     try{
//           const {email} = req.body;

//           const validUser =await User.findOne({email});

//           if(!validUser){
//             next(errorHandler(400,"user is not valid"));
//           }
       
//           const token = jwt.sign({id:validUser._id},process.env.jwt_secret);

//           var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'umarfarooqbcs@gmail.com',
//               pass: 'ojqo mqnq wknv qeat'
//             }
//           });
          
//           var mailOptions = {
//             from: 'umarfarooqbcs@gmail.com',
//             to: {email},
//             subject: 'reset-password',
//             text: `http://localhost:5173/resetPassword/${validUser._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('Email sent: ' + info.response);
//             }
//           }); 

//       res.json("reset successful")
//     }
//     catch(error){
//         next(error)
//     }
// }
// const resetPassword = async (req,res,next)=>{
//     try{
//         const {userId,token} = req.params;
//         const {password} = req.body;

//         jwt.verify(token, process.env.jwt_secret , async (err , user)=>{
//             if(err){
//                 return next(errorHandler(401 , "unauthorized"));
//             }
//             else{
//                 const hashpassword = bcryptjs.hashSync(password,10) 

//                 const updatedPasswrod = await User.findByIdAndUpdate(userId , {password:hashpassword});

//                 if(!updatedPasswrod){
//                     return next(errorHandler(400, "error in updating password"));
//                 }

//                 res.status(200).json("password updated successfully");
            

//             }
            
//         })
//     }
//     catch(error){
//         next(error)
//     }
// }

const google = async (req,res,next)=>{
    const { name , email , googlePhotoUrl } = req.body;
    try {
        const user =await User.findOne({email});
        if(user){
            const token = jwt.sign({id: user._id},process.env.jwt_secret);
            const {password:pass , ...rest} = user._doc;
            res.status(200).cookie('acess_token', token ,{
                httpOnly: true,               
            }).json(rest);
        }else{
            const generatedPassword =Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword , 10);
            const newUser = new User ({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const {password:pass , ...rest} = user._doc;
            res.status(200).cookie('acess_token', token ,{
                httpOnly: true,               
            }).json(rest);
        }
    } catch (error) {
        next(error)
    }
}





export {signup,signin,forgotPassword,resetPassword , google}