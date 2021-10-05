import { NotExtended } from "http-errors";
import LpnData from "../../models/LpnData";
import Product from "../../models/Product";
import Slot from "../../models/Slot";
import { reader, allocator } from '../opcua.controller/opcua.controller.mjs';

const nodeIds = {
	slot01: "ns=4;i=5",
	slot01Full: "ns=4;i=2"
};

const greenLight = "ns=4;i=5";
const blueLight = "ns=4;i=2";

// Reserve filter midddleware
export const reserveFilter = async (req, res, next) => {
	const {
		lpn
	} = req.params;

	const objJs = await Product.find({
		lpnAssociates: lpn
	});

	if (objJs.length === 0 ) 
	return res.status(403).json({ 
		message: `the lpn ${lpn} isn't associates to the product collection.
		message: make sure you have the necessary metadata to process the product` 
	});

	try {

		// find de reserve
	
		req.product = objJs
		//extract data of the objectjs

        var reserve = objJs[0].reserve; //strig
		var lpns = objJs[0].lpnAssociates; //strings array

		//add the reserve data to slot 
		// filter the reserve in the Slot collection  
		const existReserve = await Slot.findOne({
			"reserve": reserve
		});
		///////////////////////////////////////////////////////////////////////////////////
		// if there is no reservation it assigns it to an empty slot
		if (!existReserve) {
			const sloting = await Slot.findOneAndUpdate({
				"reserve": ""
			}, {
				$set: {
					"reserve": reserve,
					"lpnAssociates": lpns
				}
			});
		///////////////////////////////////////////////////////////////////////////////////
		// assign a fisical slot 
			await allocator(nodeIds.slot01);
		///////////////////////////////////////////////////////////////////////////////////
			console.log("reserve assigned");
			next();
		} else {
			console.log("The reserve alredy exist in a Slot" )
			next();
		};
		//////////////////////////////////////////////////////////////////////////////////////
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: "error in reserve filter" 
		});
	}
};
/////////////////////////////////////////////////////////////////////////////////////////////
// adding lpns in the collection 
export const addLpns = async (req, res, next) => {
	const {
		lpn
	} = req.params;
	try {
		const objJs = req.product
		//extract data of the objectjs
		var reserve = objJs[0].reserve; //strig
		var lpnAss = objJs[0].lpnAssociates; // strings array

		// find the slot id associate to reserve 
		const idSlotInReserve = await Slot.findOne({
			"reserve": reserve
		});

		var slotId = idSlotInReserve.slot;
		//////////////////////////////////////////////////////////////////////////////////////
		// add each of the lpn to the collection
		for (var i = 0; i < lpnAss.length; i++) {

			const lpnExist = await LpnData.findOne({
				lpn: lpnAss[i]
			});

			if (!lpnExist){
				const newLpn = new LpnData({
					lpn: lpnAss[i],
					reserve,
					state: false,
					slot: slotId,
				});
				await newLpn.save();

				console.log(`the lpn ${lpnAss[i]} was added successfully `);
/* 				console.log(lpnAss[i]);
				console.log(lpn);
				console.log(typeof(lpnAss[i]));
				console.log(typeof(lpn));
				console.log(lpnAss[i] === lpn); */

			} if (lpnAss[i] === lpn){

				const lpnObj = await LpnData.findOne({
					lpn: lpn
				});
	
				const stateLpn = lpnObj.state;
				
				if ( stateLpn == true ) {

					//turn on the light of the slot
					await allocator(nodeIds.slot01);

					console.log(`the lpn ${lpnAss[i]} has already been processed `);
				
					continue;
					
				} else if (stateLpn == false){

					await LpnData.findOneAndUpdate({
						lpn: lpn
					}, {
						$set: {
							"state": true
						}
					});
					// turn on the light of the previously associated slot
					await allocator(nodeIds.slot01);

					console.log(`the lpn ${lpn} was marked like processed `);

				}
			} else {
				console.log("the lpn was added but not processed");
				continue;
			}
		};
		next();
		} catch (error) {
		console.log(error);
		res.status(400).json({
			message: error
		});
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////
// solo para probar, funcion principal podria usar el opc 
// obtener todos los lpns asociados a una reserva y consultar por sus state , si son todos true , el pedido esta completo ! 
export const checkCompleteOrders = async (req, res, next) => {
	const {
		lpn
	} = req.params;
	try {
		var count = 0;
		const lpnData = await LpnData.find({
			lpn: lpn
		});
		var reserveId = lpnData[0].reserve; //strig
		//console.log(reserveId);

		const lpns = await LpnData.find({
			reserve: reserveId
		});
		//console.log(lpns);
		
		for (var i = 0; i <= lpns.length-1; i++) {

		// if exist the lpn, verify if the lpn proccess is in the array if so, change your status
			var lpnState = lpns[i].state;
			if (lpnState == true) {
				//console.log(`"lpn state of ${i} is true"`);
				count ++;
				if(count == lpns.length) {

					//console.log("count: " + count);
					//console.log("lenght: " + lpns.length);
					//console.log(count == lpns.length);

					// assign a fisical slot 
					await allocator(nodeIds.slot01Full);
					console.log("the order its complete");
					
				}
			} else {
				break;
			}
		};
		next();
	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: error
		});
	}
};
////////////////////////////////////////////////////////////////////////////////////////////////
export const final = async (req, res, next) => {
	const {
		lpn
	} = req.params;
	try {
		
		return res.status(200).json({
			message: "OK"
		});

	} catch (error) {
		console.log(error);
		res.status(400).json({
			message: error
		});
	}
};
