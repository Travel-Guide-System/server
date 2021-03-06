const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		//Getting the token from request headers
		const token = req.header("Authorization");
		if (typeof token !=undefined) {
			// If token exists simply verify it
			const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
			req.user = decodedToken;
			next();
		} else {
			handleError(res);
		}
	} catch (error) {
		handleError(res);
	}
};

function handleError(res) {
	return res.status(403).json({
		message: "Authentication Failed",
	});
}
