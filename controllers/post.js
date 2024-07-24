const sendAllPosts = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(req.postsArray))
}

module.exports = {
    sendAllPosts: sendAllPosts,
}