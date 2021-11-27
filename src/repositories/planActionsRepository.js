import connection from '../database/database.js';

export const findUserByToken = async (token) => {
  const result = await connection.query('SELECT * FROM session WHERE token = $1;', [token]);

  return result.rowCount > 0 ? result.rows[0] : false;
};

export const registerNewAddress = async (number, street, city, state, zipCode) => {
  const result = await connection.query(
    'INSERT INTO address (number, street, city, zip_code, state) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
    [number, street, city, zipCode, state],
  );

  return result.rows[0];
};

export const registerNewPlan = async (type) => {
  const result = await connection.query(`
      INSERT INTO plans (
        type,
        delivery_date
      ) VALUES (
        $1, CURRENT_DATE + 1
      ) RETURNING *;
    `, [type]);

  return result.rows[0];
};

export const updateUserData = async (fullname, idAddress, idPlan, idUser) => {
  await connection.query(
    'UPDATE users SET fullname = $1, id_address = $2, id_plan = $3 WHERE id = $4 RETURNING *;',
    [fullname, idAddress, idPlan, idUser],
  );
};

export const registerProducts = async (products, idPlan) => {
  products.forEach(async (product) => {
    const result = await connection.query(
      'SELECT * FROM products WHERE name = $1',
      [product],
    );

    const { id: idProduct } = result.rows[0];

    await connection.query(
      'INSERT INTO plan_products (id_plan, id_product) VALUES ($1, $2);',
      [idPlan, idProduct],
    );
  });
};
