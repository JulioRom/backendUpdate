import { Schema, model } from "mongoose";
// TODO: change name "product" to reserve 
const productSchema = new Schema(
  {
    reserve:{
      	type: String,
      	required: [true, 'Reserve ID required']
    },
    lpnAssociates:{
		type : Array,
		required: [true, 'Reserve ID required']
	},
	reserveStatus: {
		type: String
	}

  },{
  		timestamps: true,
		versionKey: false
  }
);
  // first try schema 
  //{
  //  reserve: String,
  //  lpnAssociates: [
  //    String
  //  ],
  //  lpnSlotted: [],
  //  lpnUnslotted:[]
  //},
  //{
  //  timestamps: true,
  //  versionKey: false
  //}


export default model("Product", productSchema);
