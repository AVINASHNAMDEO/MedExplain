import mongoose from "mongoose";
import { boolean } from "webidl-conversions";


const MedicineSchema = new mongoose.Schema({
    id : {
        type : Number,
        unique : true ,
        required : true
    },
    name: { 
        type: String,
         required: true,
          unique: true 
        },
    price : {
            type: Number, 
            required: true 
           },
    Is_discontinued : {
        type : Boolean ,
        default : false
    },  
    manufacturer_name: { 
        type: String 
    },
    type : {
        type : String
    },
    pack_size_label : {
        type : String 
    },
    short_composition1 : {
        type : String ,
        required : false

    },
    short_composition2 : {
        type : String ,
        required : false
    },
 description: { 
        type: [String],
        default : ""


     },
    sideEffects: {
         type: [String] ,
         default : ""
        }, // Array of side effects

},{timestamps:true})


export const Medicine = mongoose.model("Medicine" , MedicineSchema); 