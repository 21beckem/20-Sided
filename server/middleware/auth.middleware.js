
function authorize(req, res, next) {
    // make sure there is an authorization header
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        // get the token from the header
        const token = authHeader.split(' ')[1] || "";
        // check for validity
        if (!token || token.trim() === '' || token === 'null' || token === 'undefined') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        res.locals.uid = token;
        next();
    } else {
        // stop the request if the token is missing
        res.status(401).json({ message: 'Unauthorized' });
    }
}

export default authorize;