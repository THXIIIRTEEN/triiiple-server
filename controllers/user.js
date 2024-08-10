const sendAllUser = (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(req.userArray));
    }
    catch (error) {
        console.log(error)
    }
};

const sendUserCreated = (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(req.user));
    }
    catch (error) {
        console.log(error)
    }
  }; 

const sendMe = (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(req.user));
    }
    catch (error) {
        console.log(error)
    }
};  

module.exports = {
    sendAllUser: sendAllUser,
    sendUserCreated: sendUserCreated,
    sendMe: sendMe
};