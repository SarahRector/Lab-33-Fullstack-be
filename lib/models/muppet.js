const pool = require('../utils/pool');

module.exports = class Muppet {
  id;
  name;
  performer;
  image;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.performer = row.performer;
    this.image = row.image;
  }

  static async insert(muppet) {
    const { rows } = await pool.query(
      'INSERT INTO muppets (name, performer, image) VALUES ($1, $2, $3) RETURNING *',
      [muppet.name, muppet.performer, muppet.image]
    );

    return new Muppet(rows[0]);
  }
};
