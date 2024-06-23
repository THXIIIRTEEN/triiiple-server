const allowedCors = [
    'http://localhost:3000'
  ]; 

function cors(req, res, next) {
    const { origin } = req.headers;
    
    if (allowedCors.includes(origin)) { // Если это наш друг
        res.header('Access-Control-Allow-Origin', 'GET,HEAD,PUT,PATCH,POST,DELETE', origin);
    }
    
    next();
}

module.exports = cors;