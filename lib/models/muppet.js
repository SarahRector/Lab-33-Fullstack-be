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

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM muppets'
    );

    return rows.map(row => new Muppet(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM muppets WHERE id=$1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Muppet(rows[0]);
  }

  static async update(id, muppet) {
    const { rows } = await pool.query(
      `UPDATE muppets
      SET name=$1,
        performer=$2,
        image=$3
      WHERE id=$4
      RETURNING *
      `,
      [muppet.name, muppet.performer, muppet.image, id]
    );

    return new Muppet(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM muppets WHERE id=$1 RETURNING *',
      [id]
    );

    return new Muppet(rows[0]);
  }
};
