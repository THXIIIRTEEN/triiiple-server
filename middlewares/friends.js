const user = require('../database/schemes/user');

const sendFriendReq = async (req, res) => {
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

const cancelFriendReq = async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    const result = await user.deleteRequest(userId, friendId)
    .then(() => {
        res.status(200).send(JSON.stringify("Запрос отправлен успешно"))
    });
}

const acceptReq = async (req, res) => {
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

const declineReq = async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    await user.deleteRequest(friendId, userId)
    .then(async () => {
        res.status(200).send(JSON.stringify("Запрос отклонён успешно"))
    });
}

const deleteFriend = async (req, res) => {
    const userId = req.body.userId;
    const friendId = req.body.friendId;
    await user.deleteFriend(friendId, userId)
    await user.deleteFriend(userId, friendId)
    .then(async () => {
        res.status(200).send(JSON.stringify("Запрос отклонён успешно"))
    });
}

const sendRandomUsers = async (req, res) => {
    const users = await user.find({});
    const userData = await user.findById(req.body.userId).populate({
        path: 'friend_requests',
        populate: {
          path: 'friend_requests',
        },
      });
    const randomItem = (await import('random-item')).default;
    let randomUsersArray = [];
    const getArray = async () => {
        for (let i = 0; randomUsersArray.length < 5; i++) {
            const randomUser = randomItem(users);
            if (userData.friends.includes(randomUser._id) === false && randomUsersArray.includes(randomUser) == false && userData.username != randomUser.username) {
                randomUsersArray.push(randomUser)
            }
        }
    }
    await getArray();
    res.status(200).send(randomUsersArray)
}

module.exports = {
    sendFriendReq: sendFriendReq,
    cancelFriendReq: cancelFriendReq,
    acceptReq: acceptReq,
    declineReq: declineReq,
    deleteFriend: deleteFriend,
    sendRandomUsers: sendRandomUsers
}