import connection from '../database/database.js';

import validateNewPlanInfo from '../schemas/plan.schema.js';

const registerNewPlan = async (req, res) => {
  const { plan, userInfo } = req.body;
  const { authorization } = req.headers;
  const { error } = validateNewPlanInfo.validate(req.body);

  if (error) {
    return res.sendStatus(400);
  }

  if (!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const result = await connection.query(
      'SELECT * FROM sessions WHERE token = $1',
      [token],
    );

    if (result.rowCount === 0) {
      return res.sendStatus(401);
    }

    console.log({ plan, userInfo });
    const idUser = result.rows[0].id_user;

    const addressResult = await connection.query(`
      INSERT INTO address (
        number,
        street,
        city,
        complement,
        zip_code,
        state
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING *;
    `, [
      userInfo.address.number,
      userInfo.address.street,
      userInfo.address.city,
      userInfo.address.complement ? userInfo.address.complement : null,
      userInfo.address.zipCode,
      userInfo.address.state,
    ]);

    const { type, itensDelivery } = plan;

    const planResult = await connection.query(`
      INSERT INTO plans (
        type,
        delivery_date
      ) VALUES (
        $1, CURRENT_DATE + 1
      ) RETURNING *;
    `, [type]);

    const idAddress = addressResult.rows[0].id;
    const idPlan = planResult.rows[0].id;

    await connection.query(
      'UPDATE users SET fullname = $1, id_address = $2, id_plan = $3 WHERE id = $4 RETURNING *;',
      [userInfo.fullname, idAddress, idPlan, idUser],
    );

    itensDelivery.forEach(async (item) => {
      const productResult = await connection.query(
        'SELECT * FROM products WHERE name = $1',
        [item],
      );

      const idProduct = productResult.rows[0].id;

      await connection.query(
        'INSERT INTO plan_products (id_plan, id_product) VALUES ($1, $2)',
        [idPlan, idProduct],
      );
    });

    return res.sendStatus(201);
  } catch {
    return res.sendStatus(500);
  }
};

export default registerNewPlan;
