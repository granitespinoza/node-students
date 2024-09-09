const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('students.sqlite', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Ruta para manejar GET y POST en "/students"
app.route('/students')
  .get((req, res) => {
    // Consulta para obtener todos los estudiantes
    const sql = 'SELECT * FROM students';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ students: rows });
    });
  })
  .post((req, res) => {
    // Agregar un nuevo estudiante
    const { name, age } = req.body;
    const sql = 'INSERT INTO students (name, age) VALUES (?, ?)';
    db.run(sql, [name, age], function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({
        message: 'Estudiante agregado con éxito',
        data: { id: this.lastID, name, age }
      });
    });
  });

// Iniciar el servidor
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
