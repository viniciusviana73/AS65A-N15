const router = require("express").Router(),
    services = require("../services/render"),
    controller = require("../controllers/controller"),
    { jwtAuth } = require("../middlewares/jwtAuth");

// Index
router.get("/", jwtAuth, services.indexRender);
router.get("/signin", services.adminLoginRender);
router.get("/signup", services.adminSignUpRender);
router.get("/logout", controller.logout);

// Endpoint Auth
router.post("/api/admin/login", controller.login);
router.post("/api/admin/create", controller.adminCreate);

// Endpoints Estoque
router.post('/api/estoque/entrada', jwtAuth, controller.insertEntrada);
router.post('/api/estoque/saida', jwtAuth, controller.insertSaida);
router.get('/api/estoque', jwtAuth, controller.getEstoque);

// Endpoints Produto
router.get('/api/produto', jwtAuth, controller.getProduct);
router.post('/api/produto', jwtAuth, controller.createProduct);
router.put('/api/produto/:id', jwtAuth, controller.updateProduct);
router.delete('/api/produto/:id', jwtAuth, controller.deleteProduct);

// Endpoints Fornecedor
router.get('/api/fornecedor', jwtAuth, controller.getFornecedor);
router.post('/api/fornecedor', jwtAuth, controller.createFornecedor);
router.put('/api/fornecedor/:id', jwtAuth, controller.updateFornecedor);
router.delete('/api/fornecedor/:id', jwtAuth, controller.deleteFornecedor);

// Endpoint tabela
router.get('/api/table', jwtAuth, controller.getTableData);

module.exports = router;