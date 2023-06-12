const express = require('express');
const sql = require("mssql/msnodesqlv8");
const app = express();
const PORT = 3000;
const path = require('path');

// Połączenie z bazą danych
var config = {
    server: "localhost",
    database: "SlaveMarket",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
    }
};
sql.connect(config, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Połączono z bazą danych");
});
// Endpoint do głównej strony
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'FrontEnd', 'main.html'));
});
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'FrontEnd')));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}); 

// Endpoint do rejestracji użytkownika

app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    var request = new sql.Request();
    var query = `INSERT INTO Użytkownicy (Nazwa_Użytkownika, Hasło_Użytkownika, Email) VALUES ('${username}', '${password}', '${email}')`;
    request.query(query, function(err) {
        if (err) {
            console.log(err);
            res.status(500).send('Wystąpił błąd podczas rejestracji');
            return;
        }

        res.send('Rejestracja zakończona powodzeniem!');
    });
});

// Endpoint do logowania użytkownika
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    var request = new sql.Request();
    var query = `SELECT * FROM Użytkownicy WHERE Nazwa_Użytkownika = '${username}' AND Hasło_Użytkownika = '${password}'`;
    request.query(query, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Wystąpił błąd podczas logowania');
            return;
        }
        if (result.recordset.length > 0) {
            res.send({ loggedIn: true });
        } else {
            res.send({ loggedIn: false });
        }
    });
});

app.post('/order', async (req, res) => {
    const { address, email, cart, totalPrice } = req.body;

    try {
        const getSlaveIDPromises = cart.map((item) => {
            return new Promise((resolve, reject) => {
                const getSlaveIDQuery = `SELECT ID_Produktu FROM Niewolnicy WHERE SlaveName = '${item.name}'`;
                sql.query(getSlaveIDQuery, (err, result) => {
                    if (err) {
                        console.error('Błąd podczas pobierania id niewolnika:', err);
                        reject(err);
                        return;
                    }
                    
                    const slaveID = result.recordset[0].ID_Produktu;
                    resolve(slaveID);
                });
            });
        });

        const slaveIDs = await Promise.all(getSlaveIDPromises);
        const slaveIDsString = slaveIDs.join(', ');
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", slaveIDsString);

        // Zapisujemy zamówienie w bazie danych
        const insertOrderQuery = `INSERT INTO Zamówienia (Adres_Dostawy, Email, Suma_Zamówienia, slaveId) 
                                  VALUES ('${address}', '${email}', ${totalPrice}, '${slaveIDsString}')`;

        sql.query(insertOrderQuery, (err, result) => {
            if (err) {
                console.error('Błąd podczas tworzenia zamówienia:', err);
                res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia zamówienia' });
                return;
            }

            const orderId = result.insertId;

            const order = {
                id: orderId,
                address: address,
                email: email,
                totalPrice: totalPrice,
                cart: cart
            };

            res.status(200).json(order);
        });
    } catch (error) {
        console.error('Błąd podczas pobierania id niewolnika:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia zamówienia' });
    }
});
