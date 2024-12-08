const router = require("express").Router(),
    services = require("../services/render");

router.get("/", services.indexRender);

module.exports = router;