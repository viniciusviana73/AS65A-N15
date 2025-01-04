const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

exports.indexRender = async (req, res) => {
    try {
        const token = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const admin = await Admin.findById(token.AdminID).select('name email');

        return res.render('index', { admin });
    } catch (error) {
        console.error(error);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            res.clearCookie("token");
            return res.redirect("/signin");
        }

        return res.status(500).json({ message: "Houve um erro interno no servidor.", details: error });
    }
};

exports.adminSignUpRender = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.render("auth/signup");
    } catch (error) {
        return res.status(500).json({ message: "Houve um erro interno no servidor.", details: error });
    }
}

exports.adminLoginRender = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();

        if (adminCount === 0) {
            return res.render("auth/signup");
        }

        return res.render("auth/signin");
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Houve um erro interno no servidor.", details: error });
    }
}