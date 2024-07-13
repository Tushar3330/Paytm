const {JWT_SECRET} = require('../config/jwtsetup');
const jwt = require('jsonwebtoken');

const authmiddleware = (req, res, next) => {
    const authheader = req.headers.authorization;
    if(!authheader || !authheader.startsWith("Bearer ")){
        return res.status(401).send("Unauthorized");
    }
    const token = authheader.split(" ")[1];
    try {
        const userdecoded = jwt.verify(token, JWT_SECRET);

        if(userdecoded.user_id){
            req.userId = userdecoded.user_id;
            next();
        }
        else{
            res.status(401).send("Unauthorized");
        }
       
    } catch (error) {
        console.error(error);
        res.status(401).send("Unauthorized");
    }
}

module.exports = {authmiddleware};

