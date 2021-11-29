const authService = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    res.locals.token = authorization.replace('Bearer ', '');
  } else {
    res.locals.token = false;
  }

  next();
};

export default authService;
