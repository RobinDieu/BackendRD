const role = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user?.roles) {
      return res.status(403).send("Access denied");
    }

    const hasRole = req.user.roles.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      return res.status(403).send("Access denied");
    }

    next();
  };
};

module.exports = role;
