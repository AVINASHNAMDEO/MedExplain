import mongoose from "mongoose"
import bcrypt from "bcrypt"
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
       
    },
    password : {
        type : String,
        required :[true, "Password is required"],
    },

},{timestamps:true})




// 🔹 Hash password before saving
// UserSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//       return next();
//     }
//     try {
//       this.password = await bcrypt.hash(this.password, 10);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  });
  
  
  // 🔹 Method to compare passwords
  UserSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
  };
  
  // 🔹 Create and export model
  const User = mongoose.model("User", UserSchema);
  export { User };
  












// UserSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         this.password = await bcrypt.hash(this.password, 10);
//         next();
//     } catch (error) {
//         next(error);
//     }
// });





// // userSchema.methods.comparePassword = async function(password){
// //     return await bcrypt.compare(password , this.password)
// // }

// // Method to compare passwords
// UserSchema.methods.comparePassword = async function (inputPassword) {
//     try {
//         return await bcrypt.compare(inputPassword, this.password);
//     } catch (error) {
//         throw new Error(error);
//     }
// };



// export const User = mongoose.model("User" , UserSchema);