const verifyAdminRole = (req, res, next) => {
    // Assuming you have a 'role' field in your user model
    if (req.user.role === 'admin') {
        next(); // Allow the request to proceed to the next middleware or route handler
    } else {
        res.status(403).json({ error: 'Unauthorized' }); // Return a 403 Forbidden error if the user is not an admin
    }
};

module.exports = verifyAdminRole;
