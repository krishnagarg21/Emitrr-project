const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'game.db');
const db = new sqlite3.Database(dbPath);

// Helper to mimic 'pg' pool.query syntax
const pool = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      const isSelect = text.trim().toUpperCase().startsWith('SELECT');

      // Convert $1, $2 to ?, ? for sqlite
      let paramIdx = 0;
      const sql = text.replace(/\$\d+/g, () => '?');

      if (isSelect) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve({ rows });
        });
      } else {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve({ rows: [], rowCount: this.changes });
        });
      }
    });
  }
};

const initDB = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                draws INTEGER DEFAULT 0
            )`);

      db.run(`CREATE TABLE IF NOT EXISTS games (
                id TEXT PRIMARY KEY,
                player1 TEXT,
                player2 TEXT,
                winner TEXT,
                result TEXT,
                played_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
        if (err) {
          console.error('Error initializing DB', err);
          reject(err);
        } else {
          console.log('SQLite Database initialized');
          resolve();
        }
      });
    });
  });
};

module.exports = { pool, initDB };
