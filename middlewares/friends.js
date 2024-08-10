const user = require('../database/schemes/user');

const sendFriendReq = async (req, res) => {
    try {
        const userId = req.body.userId;
        const friendId = req.body.friendId;
        const userData = await user.findById(friendId);
        const isRequest = userData.friend_requests.find(id => id == userId);
        if (isRequest === undefined) {
            const result = await user.updateOne(
                { _id: friendId },
                { $push: { friend_requests: { _id: userId } } }
            )
            .then(() => {
                res.status(200).send(JSON.stringify("Запрос отправлен успешно"))
            });
        }
    }
    catch (error) {
        console.log(error)
    }
}

const cancelFriendReq = async (req, res) => {
    try {
        const userId = req.body.userId;
        const friendId = req.body.friendId;
        const result = await user.deleteRequest(userId, friendId)
        .then(() => {
            res.status(200).send(JSON.stringify("Запрос отправлен успешно"))
        });
    }
    catch (error) {
        console.log(error)
    }
}

const acceptReq = async (req, res) => {
    try {
        const userId = req.body.userId;
        const friendId = req.body.friendId;
        await user.deleteRequest(friendId, userId)
        .then(async () => {
            const result = await user.updateOne(
                { _id: userId },
                { $push: { friends: { _id: friendId } } }
            )
            .then(async () => {
                const result = await user.updateOne(
                    { _id: friendId },
                    { $push: { friends: { _id: userId } } }
                )
            })
            .then(() => {
                res.status(200).send(JSON.stringify("Запрос принят успешно"))
            })
        });
    }
    catch (error) {
        console.log(error)
    }
}

const declineReq = async (req, res) => {
    try {
        const userId = req.body.userId;
        const friendId = req.body.friendId;
        await user.deleteRequest(friendId, userId)
        .then(async () => {
            res.status(200).send(JSON.stringify("Запрос отклонён успешно"))
        });
    }
    catch (error) {
        console.log(error)
    }
}

const deleteFriend = async (req, res) => {
    try {
        const userId = req.body.userId;
        const friendId = req.body.friendId;
        await user.deleteFriend(friendId, userId)
        await user.deleteFriend(userId, friendId)
        .then(async () => {
            res.status(200).send(JSON.stringify("Запрос отклонён успешно"))
        });
    }
    catch (error) {
        console.log(error)
    }
}

const sendRandomUsers = async (req, res) => {
    try {
        const users = await user.find({});
        const userData = await user.findById(req.body.userId).populate({
            path: 'friend_requests',
            populate: {
            path: 'friend_requests',
            },
        });
        const randomItem = (await import('random-item')).default;
        let randomUsersArray = [];
        const getNotFriends = async () => {
            let notFriendedUsers = 0; 
            for (let i = 0; users.length != i; i++) {
                if (userData.friends.includes(users[i]._id) === false) {
                    notFriendedUsers++
                }
            }
            return notFriendedUsers
        }
        const getArray = async () => {
            const notFriends = await getNotFriends();
            for (let i = 0; randomUsersArray.length < 5 && randomUsersArray.length != notFriends - 1; i++) {
                const randomUser = randomItem(users);
                if (userData.friends.includes(randomUser._id) === false && randomUsersArray.includes(randomUser) == false && userData.username != randomUser.username) {
                    randomUsersArray.push(randomUser);
                }
            }
        }
        await getArray();
        res.status(200).send(randomUsersArray)
    }
    catch (error) {
        console.log(error)
    }
}

const findUserByUsername = async (req, res) => {
    try {
        const username = req.body.username;
        const userData = await user.findUserByUsername(username);
        res.status(200).send(JSON.stringify(userData));
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendFriendReq: sendFriendReq,
    cancelFriendReq: cancelFriendReq,
    acceptReq: acceptReq,
    declineReq: declineReq,
    deleteFriend: deleteFriend,
    sendRandomUsers: sendRandomUsers,
    findUserByUsername: findUserByUsername
}