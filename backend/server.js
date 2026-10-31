require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 24) {
  console.error('Configure JWT_SECRET no arquivo backend/.env com pelo menos 24 caracteres.');
  process.exit(1);
}
app.use(express.json());

function startServer() {
  const dbPath = path.join(__dirname, 'senaicream.db');
  const SQL = initSqlJs();
  SQL.then((SQL) => {
    const db = fs.existsSync(dbPath)
      ? new SQL.Database(fs.readFileSync(dbPath))
      : new SQL.Database();

    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);
    const salvarBanco = () => fs.writeFileSync(dbPath, Buffer.from(db.export()));
    salvarBanco();

    function consultar(sql, valores = []) {
      const stmt = db.prepare(sql);
      try {
        stmt.bind(valores);
        return stmt.step() ? stmt.getAsObject() : null;
      } finally { stmt.free(); }
    }
    function executar(sql, valores = []) {
      db.run(sql, valores);
      const id = consultar('SELECT last_insert_rowid() AS id');
      salvarBanco();
      return id ? id.id : null;
    }
    function gerarToken(cliente) {
      return jwt.sign({ sub: String(cliente.id), email: cliente.email, nome: cliente.nome }, JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
    }
    function autenticar(req, res, next) {
      const cabecalho = req.headers.authorization || '';
      const [tipo, token] = cabecalho.split(' ');
      if (tipo !== 'Bearer' || !token) return res.status(401).json({ erro: 'Token não informado.' });
      try { req.usuario = jwt.verify(token, JWT_SECRET); next(); }
      catch { return res.status(401).json({ erro: 'Token inválido ou expirado.' }); }
    }

    app.post('/api/auth/register', (req, res) => {
      const nome = String(req.body.nome || '').trim();
      const email = String(req.body.email || '').trim().toLowerCase();
      const senha = String(req.body.senha || '');
      if (nome.length < 2 || nome.length > 100) return res.status(400).json({ erro: 'Informe um nome entre 2 e 100 caracteres.' });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ erro: 'Informe um e-mail válido.' });
      if (senha.length < 8 || senha.length > 72) return res.status(400).json({ erro: 'A senha deve ter entre 8 e 72 caracteres.' });
      if (consultar('SELECT id FROM clientes WHERE email = ?', [email])) return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
      const senhaHash = bcrypt.hashSync(senha, 12);
      try {
        const id = executar('INSERT INTO clientes (nome, email, senha_hash) VALUES (?, ?, ?)', [nome, email, senhaHash]);
        return res.status(201).json({ mensagem: 'Conta criada com sucesso.', cliente: { id, nome, email } });
      } catch (err) { return res.status(500).json({ erro: 'Não foi possível cadastrar. Tente novamente.' }); }
    });

    app.post('/api/auth/login', (req, res) => {
      const email = String(req.body.email || '').trim().toLowerCase();
      const senha = String(req.body.senha || '');
      const cliente = consultar('SELECT id, nome, email, senha_hash FROM clientes WHERE email = ?', [email]);
      if (!cliente || !bcrypt.compareSync(senha, cliente.senha_hash)) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
      const token = gerarToken(cliente);
      return res.json({ mensagem: 'Login realizado com sucesso.', token, cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email } });
    });

    app.get('/api/auth/me', autenticar, (req, res) => {
      const cliente = consultar('SELECT id, nome, email, criado_em FROM clientes WHERE id = ?', [Number(req.usuario.sub)]);
      if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado.' });
      return res.json({ cliente });
    });

    const pastaSite = path.resolve(__dirname, '..');
    app.use(express.static(pastaSite));
    app.get('/', (_req, res) => res.sendFile(path.join(pastaSite, 'index.html')));
    app.listen(PORT, () => {
      console.log(`SenaiCream rodando em http://localhost:${PORT}`);
      console.log(`Banco SQLite: ${dbPath}`);
    });
  }).catch((err) => {
    console.error('Não foi possível iniciar o banco SQLite:', err);
    process.exit(1);
  });
}
startServer();
