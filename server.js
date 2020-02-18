const express = require('express');
const server = express();

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: 123456,
  host: 'localhost',
  port: 5432,
  database: 'doe'
});

const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true
});

server.get('/', (req, res) => {
  db.query('SELECT * FROM donors', (err, result) => {
    if (err) return res.send('Erro no banco de dados.');

    const donors = result.rows;

    return res.render('index.html', { donors });
  });
});

server.post('/', function(req, res) {
  const { name, email, blood } = req.body;

  if (name.length === 0 || email.length === 0 || blood.length === 0) {
    return res.send('Todos os campos são obrigatórios');
  }

  const query = 'INSERT INTO donors (name, email, blood) VALUES ($1, $2, $3)';
  const values = [name, email, blood];

  db.query(query, values, err => {
    if (err) return res.send('Erro no banco de dados.');

    return res.redirect('/');
  });
});

server.listen(3000);
