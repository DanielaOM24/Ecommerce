import { Model, model, Schema } from "mongoose";

const productsSchema = new Schema({
    productId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    talla: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,     
    },
    image: {
        type: String,
        required: true,
    },
    inStock: {
        type: Boolean,
        required: true, 
    }
}, );

let Products: Model<any>;
try {
    Products = model("products");
} catch (error) {
    Products = model("products", productsSchema)
}

export default Products;