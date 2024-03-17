import mongoose from "mongoose";

let isConnected = false;
const connectToDB = async (url) => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  } else {
    try {
      await mongoose.connect(url, {
        dbName: "Mini-projet",
      });

      isConnected = true;

      console.log("MongoDB is connected");
    } catch (error) {
      console.log(error);
    }
  }
};

export default connectToDB;
