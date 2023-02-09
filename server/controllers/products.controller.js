import Product from "../models/products.model.js"

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import deleteFile from "../helpers/deleteFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const createProduct = async  (req, res) => {
  const { name, desc, category, price, imgURL } = req.body;
  try {
    let product = new Product({
      name: name,
      desc: desc,
      category: category,
      price: price
    });

    if (req.file.filename) {
      product.imgURL = req.file.filename;
    }

    console.log("FALLO")

    const productdb = await product.save();

    res.status(201).json({
      ok: true,
      message: "Product saved successfully",
      product: productdb
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      err: "Error del servidor"
    })
  }
}

const getProducts = (req, res) => {
  let offset = req.query.offset || 0;
  offset = Number(offset);

  let limit = req.query.limit || 5;
  limit = Number(limit);

  Product.find({ available: true })
    .skip(offset)
    .limit(limit)
    .exec( (err, products) => {

      console.log(products)

      if (err) {
        return res.status(400).json({
          ok: false,
          message: "Bad Request"
        })
      }

      Product.count( (err, count) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: "Bad Request"
          })
        }
        console.log({
          ok: true,
          count: count,
          products: products
        })
        res.status(200).json({
          ok: true,
          count: count,
          products: products
        })
      })
    })
}

const getProduct = async (req, res) => {
  try {

    const productdb = await Product.findById({ _id: req.params.id })

    if (!productdb) {
      return res.status(404).json({
        ok: false,
        message: "Product not found"
      })
    }

    res.status(200).json({
      ok: true,
      product: productdb
    })
    
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor"
    })
  }

}

const updateProduct = async (req, res) => {
  try {
    let productdb = await Product.findById({ _id: req.params.id });
    if( !productdb ) {
      return res.status(404).json({
        ok: false,
        message: "Product not found"
      })
    }

    let newProduct = {
      name: req.body.name || productdb.name,
      desc: req.body.desc || productdb.desc,
      price: req.body.price || productdb.price,
      category: req.body.category || productdb.category
    }

    // verificar si viene una imagen
    if (req.file) {
      console.log("IF");
      newProduct.imgURL = req.file.filename;
  
    } else {
      console.log("ELSE")
      newProduct.imgURL = productdb.imgURL;
    }

    const productUpdate = await productdb.updateOne({ $set: newProduct })

    const dirname = path.join(__dirname, "../../uploads")
    deleteFile(dirname, productdb.imgURL)

    res.status(200).json({
      ok: true,
      message: "Product updated successfully",
      product: productUpdate
    })
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      message: "Error del servidor"
    })
  }

}


const deleteProduct = async (req, res) => {
  try {
    const productdb = await Product.findById({ _id: req.params.id });

    if(!productdb) {
      return res.status(404).json({
        ok: false,
        message: "Product not found"
      })
    }

    const dirname = path.join(__dirname, "../../uploads")

    await Product.findByIdAndRemove({ _id: req.params.id })

    deleteFile(dirname, productdb.imgURL);

    res.status(200).json({
      ok: true,
      message: "Product deleted successfully"
    })
    
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: "Error del servidor"
    })
  }
}


export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
}