import { Schema, model } from "mongoose";

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
	},
	nodes:{
		type: Array
	}
},
{
	timestamps: true,
	versionKey: false
}
);

export default model("Slot", slotSchema);
