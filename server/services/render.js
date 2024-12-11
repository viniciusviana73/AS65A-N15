const Admin = require("../models/Admin");

exports.indexRender = async (req, res) => {
    return res.render('index');
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