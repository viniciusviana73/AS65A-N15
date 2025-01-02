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

async function addProductStock() {
    const productId = document.getElementById('product-entrada').value;
    const quantityInput = document.getElementById('entrada').value.trim();
    const quantity = parseInt(quantityInput, 10);

    if (!productId || isNaN(quantity) || quantity <= 0) {
        alert('Selecione um produto e insira uma quantidade válida.');
        return;
    }

    try {
        const response = await fetch(`/api/produto/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ stock: quantity }),
        });

        if (response.ok) {
            alert('Estoque atualizado com sucesso!');
            closeEProductPopup();
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar estoque: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        alert('Não foi possível atualizar o estoque.');
    }
}

async function removeProductStock() {
    const productId = document.getElementById('product-saida').value;
    const quantityInput = document.getElementById('saida').value.trim();
    const quantity = parseInt(quantityInput, 10);

    if (!productId || isNaN(quantity) || quantity <= 0) {
        alert('Selecione um produto e insira uma quantidade válida.');
        return;
    }

    try {
        const response = await fetch(`/api/produto/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ stock: -quantity }),
        });

        if (response.ok) {
            alert('Estoque atualizado com sucesso!');
            closeSProductPopup();
        } else {
            const errorData = await response.json();
            alert(`Erro ao atualizar estoque: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao atualizar estoque:', error);
        alert('Não foi possível atualizar o estoque.');
    }
}

document.querySelector('#eproduct-modal .add').addEventListener('click', addProductStock);
document.querySelector('#sproduct-modal .add').addEventListener('click', removeProductStock);

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

function toggleNotification() {
    const icon = document.getElementById('notification-icon');
    const currentSrc = icon.src;
    const notificationIcon1 = 'https://img.icons8.com/?size=100&id=83193&format=png&color=000000';
    const notificationIcon2 = 'https://img.icons8.com/?size=100&id=urdIu7TqL6dp&format=png&color=000000';


    if (currentSrc.includes(notificationIcon1)) {
        icon.src = notificationIcon2;
    } else {
        icon.src = notificationIcon1;
    }
}

function togglePopup() {
    const popup = document.getElementById('popup');
    popup.classList.toggle('show');
}

function logout() {
    window.location.href = 'index.html';
}

document.querySelector('.close').addEventListener('click', closePopup);

function openPopup() {
    document.querySelector('#main-modal').style.display = 'flex';
}

function closePopup() {
    document.querySelector('#main-modal').style.display = 'none';
}

function openInstitutionPopup() {
    document.querySelector('#institution-modal').style.display = 'flex';
}

function closeInstitutionPopup() {
    document.querySelector('#institution-modal').style.display = 'none';
}

async function openProductPopup() {
    document.querySelector('#product-modal').style.display = 'flex';
    const distributorSelect = document.querySelector('#distributor-select');
    distributorSelect.innerHTML = '<option value="">Carregando distribuidores...</option>';

    try {
        const response = await fetch('/api/fornecedor', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            const distributors = await response.json();
            distributorSelect.innerHTML = '<option value="">Selecione um distribuidor</option>';

            distributors.forEach(distributor => {
                const option = document.createElement('option');
                option.value = distributor._id;
                option.textContent = distributor.name;
                distributorSelect.appendChild(option);
            });
        } else {
            distributorSelect.innerHTML = '<option value="">Erro ao carregar distribuidores</option>';
        }
    } catch (error) {
        console.error('Erro ao carregar distribuidores:', error);
        distributorSelect.innerHTML = '<option value="">Erro ao carregar distribuidores</option>';
    }
}

async function fetchAndPopulateProducts() {
    try {
        const response = await fetch('/api/produto', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const products = await response.json();

        const entradaSelect = document.getElementById('product-entrada');
        const saidaSelect = document.getElementById('product-saida');

        entradaSelect.innerHTML = '';
        saidaSelect.innerHTML = '';

        products.forEach((product) => {
            const optionEntrada = document.createElement('option');
            optionEntrada.value = product._id;
            optionEntrada.textContent = product.name;

            const optionSaida = document.createElement('option');
            optionSaida.value = product._id;
            optionSaida.textContent = product.name;

            entradaSelect.appendChild(optionEntrada);
            saidaSelect.appendChild(optionSaida);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        alert('Não foi possível carregar os produtos.');
    }
}

function closeProductPopup() {
    document.querySelector('#product-modal').style.display = 'none';
}

function openEProductPopup() {
    fetchAndPopulateProducts();
    document.querySelector('#eproduct-modal').style.display = 'flex';
}

function closeEProductPopup() {
    document.querySelector('#eproduct-modal').style.display = 'none';
}

function openSProductPopup() {
    fetchAndPopulateProducts();
    document.querySelector('#sproduct-modal').style.display = 'flex';
}

function closeSProductPopup() {
    document.querySelector('#sproduct-modal').style.display = 'none';
}