import mongoose from "mongoose";

const dbOptions = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  authMechanism: "DEFAULT",
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
};

export const connectDb = async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION_STRING, dbOptions);
  console.log("Connected to database");
};
