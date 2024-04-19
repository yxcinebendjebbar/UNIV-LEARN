import pkg from "mongoose";
const { Schema, model } = pkg;

const adminSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true 
  },
});

const Admin = model("Admin", adminSchema);

// Assume userId is the ObjectId of an existing user in your User collection
//const userId = '661fd947c80e22b35386ea73'; // Replace this with an actual userId

// Create a new admin object
//const newAdmin = new Admin({ userId });

// Save the new admin object to the database
//newAdmin.save()
//  .then((admin) => {
//    console.log('Admin added successfully:', admin);
//  })
//  .catch((error) => {
//    console.error('Error adding admin:', error);
//  });

export default Admin;