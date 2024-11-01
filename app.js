const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');


const app = express();
const port = 3000;

// Configura o body-parser para interpretar JSON
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: 'localhost',   // substitua pelo host do seu banco de dados
    user: 'root', // substitua pelo seu usuário do MySQL
    password: 'root', // substitua pela sua senha do MySQL
    database: 'crud_db'
});

// Conecta ao banco de dados
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

// Rota para criar um novo item (Create)
app.post('/items', (req, res) => {
    const { name, description, quantity } = req.body;
    
    // Log para verificar o conteúdo do corpo da requisição
    console.log("Body da requisição:", req.body);
    console.log("Valor de 'name':", name);

    // Verifica se o campo 'name' está preenchido
    if (!name) {
        return res.status(400).json({ error: "O campo 'name' é obrigatório." });
    }

    const query = 'INSERT INTO items (name, description, quantity) VALUES (?, ?, ?)';
    db.query(query, [name, description, quantity], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, name, description, quantity });
    });
});

// Rota para obter todos os itens (Read)
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Rota para obter um item específico pelo ID (Read)
app.get('/items/:id', (req, res) => {
    const query = 'SELECT * FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json(results[0]);
    });
});

// Rota para atualizar um item pelo ID (Update)
app.put('/items/:id', (req, res) => {
    const { name, description, quantity } = req.body;
    const query = 'UPDATE items SET name = ?, description = ?, quantity = ? WHERE id = ?';
    db.query(query, [name, description, quantity, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json({ message: 'Item atualizado com sucesso' });
    });
});

// Rota para deletar um item pelo ID (Delete)
app.delete('/items/:id', (req, res) => {
    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json({ message: 'Item deletado com sucesso' });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
