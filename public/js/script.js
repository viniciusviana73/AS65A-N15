(async function fillTable() {
    const tbody = document.querySelector('.product-table tbody');
    tbody.innerHTML = '';

    try {
        const data = await fetch('/api/table', { method: 'GET', headers: { 'Content-Type': 'application/json', }, });
        const response = await data.json();
        console.log("response:");
        console.log(response);

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