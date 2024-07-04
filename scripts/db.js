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
            PRIMARY KEY (userId)
          )`, (err) => {
            if (err) {
              console.error('Erreur lors de la création de la table:', err);
              return reject(err);
            }
            resolve(); // Résoudre la promesse si tout s'est bien passé
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
            resolve(results); // Résoudre avec les résultats de la requête
          }
          connection.end(); // Fermer la connexion après l'exécution de la requête
        });
      })
      .catch((err) => {
        console.error('Erreur lors de la configuration de la base de données:', err);
        reject(err);
        connection.end(); // Assurez-vous de fermer la connexion en cas d'erreur
      });
  });
}

module.exports = {
  handleMySQLQuery,
};
