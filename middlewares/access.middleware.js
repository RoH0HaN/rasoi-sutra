const authorizeAccessPermissions = (...allowedRoles) => {
  return (req, res, next) => {
    // Assuming req.user is already set by your authentication middleware (e.g., verifyJWT)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: no user info" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: access denied" });
    }

    next();
  };
};

export { authorizeAccessPermissions };
