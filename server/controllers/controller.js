const Product = require("../models/Product"),
    Movimentacao = require("../models/StockRecord"),
    Distribuidor = require("../models/Distribuidor"),
    mongoose = require("mongoose");

exports.insertEntrada = async (req, res) => {
    const { productId, distribuidorId, quantity } = req.body;

    if (!productId || !distribuidorId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Dados inválidos.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

        product.stock += quantity;
        await product.save();

        await Movimentacao.create({
            productId,
            distribuidorId,
            type: 'entrada',
            quantity
        });

        return res.status(200).json({ message: 'Entrada registrada com sucesso.', product });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao registrar entrada.', details: error });
    }
};

exports.insertSaida = async (req, res) => {
    const { productId, distribuidorId, quantity } = req.body;

    if (!productId || !distribuidorId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Dados inválidos.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Estoque insuficiente.' });
        }

        product.stock -= quantity;
        await product.save();

        await Movimentacao.create({
            productId,
            distribuidorId,
            type: 'saida',
            quantity
        });

        return res.status(200).json({ message: 'Saída registrada com sucesso.', product });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao registrar saída.', details: error });
    }
};

exports.getEstoque = async (req, res) => {
    const { productId, distribuidorId } = req.query;

    const filter = {};
    if (productId) filter.productId = productId;
    if (distribuidorId) filter.distribuidorId = distribuidorId;

    try {
        const movimentacoes = await Movimentacao.find(filter)
            .populate('productId', 'name')
            .populate('distribuidorId', 'name')
            .sort({ createdAt: -1 });

        return res.status(200).json(movimentacoes);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar histórico.', details: error });
    }
}

exports.getProduct = async (req, res) => {
    try {
        if (req.query.id) {
            if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
                return res.status(400).json({ message: 'ID do produto inválido.' });
            }

            const product = await Product.findById(req.query.id).populate('distribuidorID', 'name');

            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado.' });
            }

            return res.status(200).json(product);
        }

        const products = await Product.find();
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar o produto.', details: error });
    }
}

exports.createProduct = async (req, res) => {
    try {
        console.log(req.body);
        const { name, isDonate, amount, distribuidorID, stock } = req.body;

        if (!name || !distribuidorID || amount < 0 || stock < 0) {
            return res.status(400).json({ message: 'Dados inválidos para criar o produto.' });
        }

        if (!mongoose.Types.ObjectId.isValid(distribuidorID)) {
            return res.status(400).json({ message: 'ID do distribuidor inválido.' });
        }

        const distribuidor = await Distribuidor.findById(distribuidorID);
        if (!distribuidor) {
            return res.status(404).json({ message: 'Distribuidor não encontrado.' });
        }

        const newProduct = new Product({
            name,
            isDonate,
            amount,
            distribuidorID,
            stock
        });

        await newProduct.save();
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao criar o produto.', details: error });
    }
}

exports.updateProduct = async (req, res) => {
    const { name, isDonate, amount, distribuidorID, stock } = req.body;

    if (!name || !distribuidorID || amount < 0 || stock < 0) {
        return res.status(400).json({ message: 'Dados inválidos para editar o produto.' });
    }

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, isDonate, amount, distribuidorID, stock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao editar o produto.', details: error });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar o produto.', details: error });
    }
}

exports.getFornecedor = async (req, res) => {
    try {
        if (req.query.id) {

            const fornecedor = await Distribuidor.findById(req.query.id);
            if (!fornecedor) {
                return res.status(404).json({ message: 'Fornecedor não encontrado.' });
            }

            return res.status(200).json(fornecedor);
        }

        const fornecedores = await Distribuidor.find();
        return res.status(200).json(fornecedores);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar fornecedor(es).', details: error });
    }
};

exports.createFornecedor = async (req, res) => {
    const { name, previouslyShipped, neededPerMonth } = req.body;

    if (!name || !previouslyShipped || !neededPerMonth) {
        return res.status(400).json({ message: 'Dados inválidos para criar o fornecedor.' });
    }

    try {
        const newFornecedor = new Distribuidor({
            name,
            previouslyShipped,
            neededPerMonth
        });

        await newFornecedor.save();
        return res.status(201).json(newFornecedor);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao criar fornecedor.', details: error });
    }
};

exports.updateFornecedor = async (req, res) => {
    const { name, previouslyShipped, neededPerMonth } = req.body;

    if (!name || !previouslyShipped || !neededPerMonth) {
        return res.status(400).json({ message: 'Dados inválidos para editar o fornecedor.' });
    }

    try {
        const fornecedor = await Distribuidor.findByIdAndUpdate(
            req.params.id,
            { name, previouslyShipped, neededPerMonth },
            { new: true }
        );

        if (!fornecedor) {
            return res.status(404).json({ message: 'Fornecedor não encontrado.' });
        }

        return res.status(200).json(fornecedor);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao editar fornecedor.', details: error });
    }
};

exports.deleteFornecedor = async (req, res) => {
    try {
        const fornecedor = await Distribuidor.findByIdAndDelete(req.params.id);

        if (!fornecedor) {
            return res.status(404).json({ message: 'Fornecedor não encontrado.' });
        }

        return res.status(200).json({ message: 'Fornecedor deletado com sucesso.' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar fornecedor.', details: error });
    }
};