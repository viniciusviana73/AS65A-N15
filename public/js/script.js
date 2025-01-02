document.addEventListener('DOMContentLoaded', () => {
    // Create Distribuidor
    const addDistribuidorButton = document.querySelector('#institution-modal .add');
    addDistribuidorButton.addEventListener('click', async () => {
        const institutionName = document.querySelector('#institution-name').value.trim();
        const previouslyShippedYes = document.querySelector('#yes').checked;
        const previouslyShippedNo = document.querySelector('#no').checked;
        const quantity = parseInt(document.querySelector('#quantity').value.trim(), 10);
        const averageNeed = parseInt(document.querySelector('#average-need').value.trim(), 10);

        if (!institutionName) {
            alert('O nome da instituição é obrigatório.');
            return;
        }

        if (!previouslyShippedYes && !previouslyShippedNo) {
            alert('Por favor, informe se já foram enviados produtos para esta instituição.');
            return;
        }

        if (previouslyShippedYes && (isNaN(quantity) || quantity < 0)) {
            alert('Se já foram enviados produtos, insira uma quantidade válida.');
            return;
        }

        if (isNaN(averageNeed) || averageNeed < 0) {
            alert('Insira uma média válida de necessidade de produtos por mês.');
            return;
        }

        const fornecedorData = {
            name: institutionName,
            previouslyShipped: {
                hasProducts: previouslyShippedYes,
                howMany: previouslyShippedYes ? quantity : 0,
            },
            neededPerMonth: averageNeed,
        };

        try {
            const response = await fetch('/api/fornecedor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(fornecedorData),
            });

            if (response.ok) {
                const createdFornecedor = await response.json();
                alert('Fornecedor criado com sucesso!');
                console.log('Fornecedor criado:', createdFornecedor);
                closeInstitutionPopup();
            } else {
                const errorData = await response.json();
                alert(`Erro ao criar o fornecedor: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao criar o fornecedor:', error);
            alert('Houve um erro ao processar sua solicitação.');
        }
    });

    // Create Products
    const addProductsButton = document.querySelector('#product-modal .add');
    addProductsButton.addEventListener('click', async () => {
        const productName = document.querySelector('#product-name').value.trim();
        const donationYes = document.querySelector('#donation-yes').checked;
        const donationNo = document.querySelector('#donation-no').checked;
        const quantity = parseInt(document.querySelector('#productsAmount').value.trim(), 10);
        const distribuidorID = document.querySelector('#distributor-select').value;

        if (!productName) {
            alert('O nome do produto é obrigatório.');
            return;
        }

        if (!donationYes && !donationNo) {
            alert('Por favor, selecione se o produto é uma doação.');
            return;
        }

        if (isNaN(quantity) || quantity < 0) {
            alert('Quantidade inválida. Insira um número maior ou igual a 0.');
            return;
        }

        if (!distribuidorID) {
            alert('Distribuidor não especificado.');
            return;
        }

        const isDonate = donationYes;

        const productData = {
            name: productName,
            isDonate,
            stock: quantity,
            distribuidorID,
        };

        try {
            const response = await fetch('/api/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                alert('Produto criado com sucesso!');
                closeProductPopup();
            } else {
                const errorData = await response.json();
                alert(`Erro ao criar o produto: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Erro ao criar o produto:', error);
            alert('Houve um erro ao processar sua solicitação.');
        }
    });
});

function closeProductPopup() {
    const modal = document.querySelector('#product-modal');
    modal.style.display = 'none';

    document.querySelector('#product-name').value = '';
    document.querySelector('#donation-yes').checked = false;
    document.querySelector('#donation-no').checked = false;
    document.querySelector('#quantity').value = '';
    document.querySelector('#distributor-select').value = '';
}

function closeInstitutionPopup() {
    const modal = document.querySelector('#institution-modal');
    modal.style.display = 'none';

    document.querySelector('#institution-name').value = '';
    document.querySelector('#yes').checked = false;
    document.querySelector('#no').checked = false;
    document.querySelector('#quantity').value = '';
    document.querySelector('#average-need').value = '';
}

(async function fillTable() {
    const tbody = document.querySelector('.product-table tbody');
    tbody.innerHTML = '';

    try {
        const data = await fetch('/api/table', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        const response = await data.json();

        response.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                        <td>${row.name}</td>
                        <td>${row.entrada}</td>
                        <td>${row.doacao}</td>
                        <td>${row.entregues}</td>
                        <td>${row.estoque}</td>
                        <td>${row.totalProdutos}</td>
                    `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error(`Erro ao preencher a tabela: ${error.message}`);
        console.error(error);
    }
})();