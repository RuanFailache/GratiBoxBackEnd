const authService = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    req.locals.token = authorization.replace('Bearer ', '');
  }

  next();
};

export default authService;
