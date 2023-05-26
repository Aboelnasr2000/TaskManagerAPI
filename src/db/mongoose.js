import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected Succesfully!")).catch(() => console.log("Couldn't Connect to Mongoose!"));
}
