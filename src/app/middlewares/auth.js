import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

export default (req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({error:'Token nor provided'});
    }

    const [, token] = authHeader.split(' ')

    try {
        jwt.verify(token,authConfig.secret, (err,result) => {

            req.userId = result.id;

            return next();

        });



    } catch (err) {
        return res.status(401).json({error:'Token Invalid'});
    }
};

