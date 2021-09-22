import { Schema, model } from "mongoose";
// TODO: change name "product" to reserve 
const lpnSchema = new Schema(
{
	lpn: {
		type: String,
		required: [true, 'lpn ID required']
	},
	reserve: {
		type: String,
		required: [true, 'reserve ID required']
	},
	state:{
		type: Boolean,
		default: false
	},
	slot: {
		type: Number,
		required: [true, 'Slot ID required']
	}
},
{
	timestamps: true,
	versionKey: false
}
);

export default model("Lpn", lpnSchema);
