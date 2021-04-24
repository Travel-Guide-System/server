require("dotenv").config();
const Service = require("./models/service");

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const services = [
	{
		user: "6083dedc18d14f14bc8ae14b",
		guide: "6083f9ad286bce4990f7d68d",
		price: 1500,
		latitude: 80,
		longitude: 90,
	},
];

const addData = ({ user, guide, price, latitude, longitude }) => {
	const self = new Service({
		user,
		guide,
		price,
		location: {
			type: "Point",
			coordinates: [longitude, latitude],
		},
	});
	self
		.save()
		.then(() => console.log("Data added"))
		.catch((error) => console.log("Error saving data", error));
};

services.forEach((item) => {
	addData(item);
});
