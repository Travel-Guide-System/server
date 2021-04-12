const express = require("express");


module.exports = async (app) => {
	const http = require("http").createServer(app);
	app.use(express.json());
	app.use(
		express.urlencoded({
			extended: true,
		})
	);
	app.use(express.static("public"));
	return app;
};
