const Admin=require("../models/adminModel")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const loginAdmin=async(req,res)=>{
    try {
        const {username,password}=req.body

        const admin=await Admin.findOne({username})

        if(!admin){
            res.status(500).json({message:"Invalid credentials!!"})
        }

        const isMatch= await bcrypt.compare(password,admin.password)
                if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports={loginAdmin}