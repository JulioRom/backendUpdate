import { Schema, model } from "mongoose";
// TODO: change name "product" to reserve 
const slotSchema = new Schema(
{
	slot: {
		type: Number,
	},
	reserve:{
		type: String,
	},
	lpnAssociates:{
		type : Array,
		state: Boolean
	}
},
{
	timestamps: true,
	versionKey: false
}
);

export default model("Slot", slotSchema);
