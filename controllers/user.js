const sendAllUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.userArray));
};

const sendUserCreated = (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.user));
  }; 

const sendMe = (req, res) => {
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify(req.user));
};  

module.exports = {
    sendAllUser: sendAllUser,
    sendUserCreated: sendUserCreated,
    sendMe: sendMe
};