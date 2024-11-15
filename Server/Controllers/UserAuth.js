import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (token == null) {
        return res.status(401).json({ message: "Token is required" });
    }
    
    jwt.verify(token, 'lostnfound', (err, user) => {
        if (err) {
            return res
            .status(403)
            .json({message: "Invalid token.Please enter a valid token or try again."});
        }
        req.user = user;
        next();
    })
}

export default authenticateToken;
