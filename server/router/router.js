const router = require("express").Router(),
    services = require("../services/render"),
    controller = require("../controllers/controller"),
    { jwtAuth } = require("../middlewares/jwtAuth");

// Index
router.get("/", jwtAuth, services.indexRender);
router.get("/signin", services.adminLoginRender);
router.post("/api/admin/login", controller.login);
router.get("/logout", controller.logout);

// Endpoints Estoque
router.post('/api/estoque/entrada', controller.insertEntrada);
router.post('/api/estoque/saida', controller.insertSaida);
router.get('/api/estoque', controller.getEstoque);

// Endpoints Produto
router.get('/api/produto', controller.getProduct);
router.post('/api/produto', controller.createProduct);
router.put('/api/produto/:id', controller.updateProduct);
router.delete('/api/produto/:id', controller.deleteProduct);

// Endpoints Fornecedor
router.get('/api/fornecedor', controller.getFornecedor);
router.post('/api/fornecedor', controller.createFornecedor);
router.put('/api/fornecedor/:id', controller.updateFornecedor);
router.delete('/api/fornecedor/:id', controller.deleteFornecedor);

module.exports = router;