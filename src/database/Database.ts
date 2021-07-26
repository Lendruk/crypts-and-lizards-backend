import mongoose from "mongoose";

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  auth: {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};

const connect = async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION_STRING, dbOptions);
};

connect().then(() => console.log("Connected Successfully to Database"));
