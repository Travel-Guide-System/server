if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const loaders = require("./loaders");

async function startServer() {
	const app = express();
	await loaders.init(app);
	app.listen(process.env.PORT || 80, (err) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log(`Server started on port ${process.env.PORT}`);
	});

	const indexRoutes = require("./routes/index");
	const userRoutes = require("./routes/user");
    const placesRoutes= require("./routes/places");
	const guideRoutes = require("./routes/guide");
	const authRoutes= require("./routes/auth");
	app.use("/guide", guideRoutes);
	app.use("/user", userRoutes);
    app.use("/places",placesRoutes);
	app.use("/auth",authRoutes);
	app.use("/", indexRoutes);
}

startServer();
