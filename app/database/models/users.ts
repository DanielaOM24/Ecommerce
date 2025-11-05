import { User } from "@heroui/react";
import { Model, model, Schema } from "mongoose";

const UsersSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
},);

let Users: Model<any>;
try {
    Users = model("users");
} catch (error) {
    Users = model("users", UsersSchema)
}

export default Users;
