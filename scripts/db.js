const mysql = require('mysql');

function connectToMySQL() {
  return mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'cytech0001',
    port: 3306,
  });
}

function setupDatabase(connection, dbName) {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return reject(err);
      }

      connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`, (err) => {
        if (err) {
          console.error('Erreur lors de la création de la base de données:', err);
          return reject(err);
        }

        connection.query(`USE ${dbName}`, (err) => {
          if (err) {
            console.error('Erreur lors de la sélection de la base de données:', err);
            return reject(err);
          }

          connection.query(`CREATE TABLE IF NOT EXISTS users (
            userId int NOT NULL AUTO_INCREMENT,  
            username varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            nom varchar(255),
            prenom varchar(255),
            date_naissance DATE,
            date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (userId)
          )`, (err) => {
            if (err) {
              console.error('Erreur lors de la création de la table:', err);
              return reject(err);
            }
            resolve();
          });
        });
      });
    });
  });
}

function handleMySQLQuery(query, params = []) {
  const connection = connectToMySQL();

  return new Promise((resolve, reject) => {
    setupDatabase(connection, 'user_db')
      .then(() => {
        connection.query(query, params, (error, results) => {
          if (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            reject(error);
          } else {
            console.log('Requête réussie:', results);
            resolve(results);
          }
          connection.end();
        });
      })
      .catch((err) => {
        console.error('Erreur lors de la configuration de la base de données:', err);
        reject(err);
        connection.end();
      });
  });
}

module.exports = {
  handleMySQLQuery,
};
