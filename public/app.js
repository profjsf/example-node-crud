const apiUrl = 'http://localhost:3000/items';

// Função para carregar itens na tabela
async function loadItems() {
    const response = await fetch(apiUrl);
    const items = await response.json();

    const tableBody = document.querySelector('#itemsTable tbody');
    tableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td class="actions">
                <button class="update" onclick="updateItem(${item.id})">Atualizar</button>
                <button onclick="deleteItem(${item.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para adicionar um novo item
document.getElementById('itemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, quantity })
    });

    loadItems();
    e.target.reset();
});

// Função para excluir um item
async function deleteItem(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    loadItems();
}

// Função para atualizar um item
async function updateItem(id) {
    const name = prompt('Digite o novo nome:');
    const description = prompt('Digite a nova descrição:');
    const quantity = prompt('Digite a nova quantidade:');

    if (name && description && quantity) {
        await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, quantity })
        });
        loadItems();
    }
}

// Carrega os itens ao carregar a página
document.addEventListener('DOMContentLoaded', loadItems);
