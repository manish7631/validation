const express = require("express")
const mongoose = require("mongoose")

const { body, validationResult } = require('express-validator');

const app = express()
app.use(express.json())


const connect = () => {
    return mongoose.connect("mongodb://127.0.0.1:27017/manish")
}



const userSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: false, unique:true },
      pincode: { type: Number, required: false },
      age: { type: Number, required: false },
      gender: { type: String, required: true },

     
    },
    {
      versionKey: false,
      timestamps: true, // createdAt, updatedAt
    }
  );
  
  // Step 2 : creating the model
  const User = mongoose.model("student", userSchema); 

  app.post("/user",
   body("firstName").not().isEmpty(),
   body("lastName").not().isEmpty(),
   body("email").isEmail(),
   body("pincode").isNumeric().isLength({ min: 6 }),
   body("age").isNumeric({min:1, max:100}),

    async (req, res) => {
    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      const user = await User.create(req.body)
         
  
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  });



app.listen(2000, async () => {
    try {
      await connect();
    } catch (err) {
      console.log(err);
    }
  
    console.log("listening on port 2000");
  });
  