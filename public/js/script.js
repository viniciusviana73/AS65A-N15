document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('#product-modal .add');

    addButton.addEventListener('click', async () => {
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