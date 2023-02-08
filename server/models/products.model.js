import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true},
    imgURL: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Product = mongoose.model("Product", productSchema);

export default Product;