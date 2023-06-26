const verifyAdminRole = (req, res, next) => {
    // Assuming you have a user object or user data stored in the request object
    const user = req.user;

    // Check if the user has an admin role or appropriate privileges
    if (user && user.role === 'admin') {
        // User is an admin, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authorized, send an error response
        res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
};

module.exports = verifyAdminRole;
