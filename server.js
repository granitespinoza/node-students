const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Para manejar form-data

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
    const { firstname, lastname, gender, age } = req.body;
    const sql = 'INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)';
    db.run(sql, [firstname, lastname, gender, age], function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({
        message: 'Estudiante agregado con éxito',
        data: { id: this.lastID, firstname, lastname, gender, age }
      });
    });
  });

// Ruta para manejar PUT en "/student/:id"
app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;
  
  const sql = 'UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?';
  const params = [firstname, lastname, gender, age, id];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Estudiante actualizado con éxito',
      data: { id, firstname, lastname, gender, age },
      changes: this.changes
    });
  });
});

// Ruta para manejar DELETE en "/student/:id"
app.delete('/student/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';

  db.run(sql, id, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Estudiante eliminado con éxito',
      changes: this.changes
    });
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
