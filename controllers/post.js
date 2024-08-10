const sendAllPosts = async(req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(req.postsArray))
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendAllPosts: sendAllPosts,
}