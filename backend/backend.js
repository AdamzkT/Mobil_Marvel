const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('kepek'));

var connection;

function kapcsolat() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'marvel2024'
    });
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/film_lekerdez', (req, res) => {
    kapcsolat();
    connection.connect(err => {
        if (err) {
            console.error('Kapcsolódási hiba: ', err);
            return res.status(500).send('Kapcsolódási hiba');
        }

        connection.query('SELECT * FROM film', (err, rows, fields) => {
            connection.end();
            if (err) {
                console.error('SQL hiba: ', err);
                return res.status(500).send('Hiba a lekérdezés során');
            }
            res.status(200).send(rows);
        });
    });
});

app.post('/szavaz', (req, res) => {
    kapcsolat();
    connection.connect(err => {
        if (err) {
            console.error('Kapcsolódási hiba: ', err);
            return res.status(500).send('Kapcsolódási hiba');
        }

        connection.query('INSERT INTO szavazat(szavazat_film) VALUES (?);', [req.body.bemenet], (err, rows, fields) => {
            connection.end();
            if (err) {
                console.error('SQL hiba: ', err);
                return res.status(500).send('Hiba az adatbevitelnél');
            }
            res.status(200).send(rows);
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
