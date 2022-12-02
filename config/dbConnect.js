const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    mongoose.connect("mongodb://localhost:27017/node_crud", {
      useNewUrlParser: true,
    });
    console.log("database connected....");
  } catch (error) {
    console.log(error);
  }
};
module.exports = dbConnect;
