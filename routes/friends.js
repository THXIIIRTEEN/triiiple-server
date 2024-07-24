const friendsRouter = require('express').Router();

const sendFriendReq = require('../middlewares/friends').sendFriendReq;
const cancelFriendReq = require('../middlewares/friends').cancelFriendReq;
const acceptReq = require('../middlewares/friends').acceptReq;
const declineReq = require('../middlewares/friends').declineReq;
const deleteFriend = require('../middlewares/friends').deleteFriend;
const sendRandomUsers = require('../middlewares/friends').sendRandomUsers;

friendsRouter.post('/friends/request', sendFriendReq);
friendsRouter.post('/friends/accept', acceptReq);
friendsRouter.post('/friends/random', sendRandomUsers);
friendsRouter.delete('/friends/request', cancelFriendReq);
friendsRouter.delete('/friends/decline', declineReq);
friendsRouter.delete('/friends/delete', deleteFriend);



module.exports = friendsRouter;