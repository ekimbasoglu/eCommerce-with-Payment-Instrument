require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyAdminRole = (req, res, next) => {
    // Assuming you have a user object or user data stored in the request object
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        return res.status(401).json({ error: 'Authorization token not found' });
    }

    const token = bearerToken.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            // Token is invalid or has expired
            return res.status(403).json({ error: 'Token is invalid or expired.' });
        } else {
            // Token is valid

            // If token doesn't have roles
            if (!decoded.user.roles) {
                return res.status(403).json({ error: 'Access denied. Admin role required.' });
            }

            // Check if the user has an admin role
            if (decoded.user.roles === 'Admin') {
                // User is an admin, proceed to the next middleware or route handler
                next();
            } else {
                // User is not authorized, send an error response
                res.status(403).json({ error: 'Access denied. Admin role required.' });
            }
        }
    });
};

module.exports = verifyAdminRole;
