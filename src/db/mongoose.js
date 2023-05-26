import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect( process.env.MONOGODB_URL , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to Mongoose Succesfully!")).catch(() => console.log("Couldn't Connect to Mongoose!"));
}
