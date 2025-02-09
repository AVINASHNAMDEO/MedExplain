// import { ApiError } from "../uttils/ApiError.js";
// import { ApiResponse } from "../uttils/ApiResponse.js";
// import { asyncHandler } from "../uttils/asyncHandler.js";
// import { Medicine } from "../models/Medicine.models.js";

// const MedicineData = asyncHandler(async (req, res) => {
//   // Get medicine details from frontend
//   const { name, short_composition1, short_composition2 } = req.body;



//   const medicine = await Medicine.find({
//     $or: [{ name }, { short_composition1 }, { short_composition2 }]
//   }).limit(30);

//   // If medicine not found
//   if (!medicine) {
//     throw new ApiError(400, "Data not found");
//   }

//   // If data is found, return response successfully
//   return res.status(200).json(
//     new ApiResponse(200, 
//       {
//         name: medicine.name,
//         description: medicine.description,
//         sideEffects: medicine.sideEffects,
//         price: medicine.price,
//         manufacturer_name: medicine.manufacturer_name,
//         type: medicine.type,
//         short_composition1: medicine.short_composition1,
//         short_composition2: medicine.short_composition2,
//         is_Discontinued: medicine.Is_discontinued
//       },
//       "Data fetched successfully"
//     )
//   );
// });

// export { MedicineData };


import { ApiError } from "../uttils/ApiError.js";
import { ApiResponse } from "../uttils/ApiResponse.js";
import { asyncHandler } from "../uttils/asyncHandler.js";
import { Medicine } from "../models/Medicine.models.js";

const MedicineData = asyncHandler(async (req, res) => {
  // Get medicine details from frontend
  const { name, short_composition1, short_composition2 } = req.body;

  // Find medicines matching any of the given criteria
  const medicines = await Medicine.find({
    $or: [{ name }, { short_composition1 }, { short_composition2 }]
  }).limit(30);

  // If no medicine is found
  if (!medicines || medicines.length === 0) {
    throw new ApiError(400, "Data not found");
  }

  // Return response with the array of medicines
  return res.status(200).json(
    new ApiResponse(200, medicines, "Data fetched successfully")
  );
});

export { MedicineData };
