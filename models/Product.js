import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//Virtuals

//total number of ratings
ProductSchema.virtual("totalReviews").get(function(){
  const product = this
  return product?.reviews?.length;
})

//averae rating
ProductSchema.virtual("averageRating").get(function(){
  let ratingsTotal = 0
  const product = this
  product?.reviews?.forEach((review)=>{
    ratingsTotal += review?.rating
  })
  const averageRating = ratingsTotal / product?.reviews?.length
  return Number(averageRating).toFixed(1)
})

const Product = mongoose.model("Product", ProductSchema);
export default Product;

//virtuals are properties that does not persist on the record inside our database but upon querying, we can have that property on the model.