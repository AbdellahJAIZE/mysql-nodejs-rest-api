const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(500).json({
            error: "Unaunthorized"
        });
    }

    let token = req.headers.authorization.split(" ")[1];    
    let refreshToken = req.headers.authorization.split(" ")[2];

    jwt.verify(token, process.env.JWT_KEY, (err, doc) => {
        if(err) {
            console.log('token is no longer valid');
            jwt.verify(refreshToken, process.env.JWT_KEY, (err, doc) => {
                if(err) {
                    console.log('refresh token is no longer valid, relogin');
                    return res.status(401).json({
                        error: "refresh token is no longer valid, relogin"
                    });
                }
                if(doc) {
                    console.log('refresh token is valid, new tokens issued');
                     token = jwt.sign(
                        {
                            doc
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1m'
                        }
                    );
                    refreshToken = jwt.sign(
                        {
                            doc
                        }, 
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }  
                    );
                    res.set('Access-Control-Expose-Headers', '*')
                    res.set('Authorization', token + " " + refreshToken);  
                    next();
                }
            });
        } 
        if(doc) {
            console.log('token is valid');
            req.data = doc;
            next();
        }
    })
};
