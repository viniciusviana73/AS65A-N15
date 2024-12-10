const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");

exports.cookieJwtAuth = async (req, res, next) => {
    let token = req.cookies.token;

    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) return next();
        if (!token) throw new Error("Token não fornecido");

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decodedToken.AdminID);

        if (!admin) return res.render("admin/signin");

        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/admin/signin");
    }
}