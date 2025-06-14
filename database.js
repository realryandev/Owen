const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const DB_FILE = path.resolve("./database.db");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.run(sql, params, function (err) {
      db.close();
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function queryOne(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.get(sql, params, (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_FILE);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function createDatabase() {
  const db = new sqlite3.Database(DB_FILE);
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      coins INTEGER DEFAULT 100,
      username TEXT,
      wins INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      phone_number TEXT,
      last_viewed_pokemon_id INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS card_views (
      user_id INTEGER,
      card_name TEXT,
      timestamp INTEGER,
      card_price INTEGER,
      card_power TEXT,
      card_toughness TEXT,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS purchases (
      user_id INTEGER,
      card_name TEXT,
      purchase_timestamp INTEGER,
      card_price INTEGER,
      card_power INTEGER,
      card_toughness INTEGER,
      card_image_url TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS fights (
      fight_id INTEGER PRIMARY KEY AUTOINCREMENT,
      winner_id INTEGER,
      loser_id INTEGER,
      timestamp INTEGER,
      FOREIGN KEY (winner_id) REFERENCES users(user_id),
      FOREIGN KEY (loser_id) REFERENCES users(user_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS caught_pokemon (
      catch_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      pokemon_id INTEGER,
      pokemon_name TEXT,
      catch_timestamp INTEGER,
      price INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
    )`);
  });
  db.close();
}

const getUserById = (userId) =>
  queryOne(`SELECT * FROM users WHERE user_id = ?`, [userId]);
const getUserByUsername = (username) =>
  queryOne(`SELECT * FROM users WHERE username = ?`, [username]);
const getUserByPhoneNumber = (phone) =>
  queryOne(`SELECT * FROM users WHERE phone_number = ?`, [phone]);
const getUserCoins = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    await createUser(id, "unknown");
    return 100;
  }
  return user.coins ?? 100;
};
const updateUserCoins = (id, coins) =>
  run("UPDATE users SET coins = ? WHERE user_id = ?", [coins, id]);
const createUser = (id, name) =>
  run("INSERT OR IGNORE INTO users (user_id, username) VALUES (?, ?)", [
    id,
    name?.toLowerCase() ?? null,
  ]);
const recordCardView = (id, name, price) =>
  run(
    "INSERT INTO card_views (user_id, card_name, timestamp, card_price) VALUES (?, ?, ?, ?)",
    [id, name, Date.now() / 1000, price]
  );
const getLastViewedCard = (id) =>
  queryOne(
    "SELECT card_name, card_price FROM card_views WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1",
    [id]
  );
const recordPurchase = (id, name, price, power, tough, img = null) =>
  run(
    "INSERT INTO purchases (user_id, card_name, purchase_timestamp, card_price, card_power, card_toughness, card_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, name, Date.now() / 1000, price, power, tough, img]
  );
const getUserInventory = (id) =>
  queryAll(
    "SELECT card_name, purchase_timestamp, card_price, card_power, card_toughness, card_image_url FROM purchases WHERE user_id = ?",
    [id]
  );
const removeFromInventory = (id, cardName) =>
  run("DELETE FROM purchases WHERE user_id = ? AND card_name = ?", [
    id,
    cardName,
  ]);
const recordFight = (winnerId, loserId) =>
  run("INSERT INTO fights (winner_id, loser_id, timestamp) VALUES (?, ?, ?)", [
    winnerId,
    loserId,
    Date.now() / 1000,
  ]);

const storeLastViewedPokemon = (userId, pokemonId) =>
  run("UPDATE users SET last_viewed_pokemon_id = ? WHERE user_id = ?", [
    pokemonId,
    userId,
  ]);
const catchPokemon = (userId, pokemonId, name, price) =>
  run(
    "INSERT INTO caught_pokemon (user_id, pokemon_id, pokemon_name, catch_timestamp, price) VALUES (?, ?, ?, ?, ?)",
    [userId, pokemonId, name, Date.now() / 1000, price]
  );
const getUserCaughtPokemon = (userId) =>
  queryAll(
    "SELECT pokemon_id, pokemon_name, catch_timestamp, price FROM caught_pokemon WHERE user_id = ?",
    [userId]
  );
const getUserPokemonCount = async (userId) =>
  (
    await queryOne(
      "SELECT COUNT(*) as count FROM caught_pokemon WHERE user_id = ?",
      [userId]
    )
  )?.count ?? 0;
const removeCaughtPokemon = (userId, pokemonId) =>
  run("DELETE FROM caught_pokemon WHERE user_id = ? AND pokemon_id = ?", [
    userId,
    pokemonId,
  ]);
const getUserCaughtPokemonIds = async (userId) =>
  (
    await queryAll("SELECT pokemon_id FROM caught_pokemon WHERE user_id = ?", [
      userId,
    ])
  ).map((r) => r.pokemon_id);
const getCaughtPokemonById = async (userId, pokemonId) =>
  await queryOne(
    "SELECT pokemon_name, catch_timestamp FROM caught_pokemon WHERE user_id = ? AND pokemon_id = ?",
    [userId, pokemonId]
  );

const getAllUsersInGroup = async (groupParticipants) => {
  const ids = groupParticipants.map((p) => `'${p}'`).join(",");
  return await queryAll(`SELECT * FROM users WHERE user_id IN (${ids})`);
};

const addXp = async (userId, amount) => {
  const user = await getUserById(userId);
  if (!user) return null;

  let { xp, level, disable_levelup_msg } = user;
  let newXp = xp + amount;
  const requiredXp = 100 + level * 25;
  let leveledUp = false;

  if (newXp >= requiredXp) {
    level += 1;
    newXp -= requiredXp;
    leveledUp = true;
  }

  await run("UPDATE users SET level = ?, xp = ? WHERE user_id = ?", [
    level,
    newXp,
    userId,
  ]);

  return {
    level,
    xp: newXp,
    leveledUp,
    disableLevelupMsg: !!disable_levelup_msg,
  };
};

async function deleteUserById(userId) {
  return await run("DELETE FROM users WHERE id = ?", userId);
}

module.exports = {
  run,
  queryOne,
  queryAll,
  createDatabase,
  getUserById,
  getUserByUsername,
  getUserByPhoneNumber,
  getUserCoins,
  updateUserCoins,
  createUser,
  recordCardView,
  getLastViewedCard,
  recordPurchase,
  getUserInventory,
  removeFromInventory,
  recordFight,
  storeLastViewedPokemon,
  catchPokemon,
  getUserCaughtPokemon,
  getUserPokemonCount,
  removeCaughtPokemon,
  getUserCaughtPokemonIds,
  getCaughtPokemonById,
  deleteUserById,
  addXp,
  getAllUsersInGroup,
};
