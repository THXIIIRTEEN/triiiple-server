const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
  },
  about_user: {
    type: String,
    required: true,
  },
  friend_requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  chats : [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'chat',
  }],
  isOnline: {
    type: Date,
    default: null
  }
});

userSchema.statics.findUserAuth = function(username, password) {
  try {
    return this.findOne( { username } )
    .then(user => {
      if (!user) {
        return null;
      }

      return bcrypt.compare(password, user.password)
        .then(identical => {
          if (!identical) {
            return null
          }

          return user;
        }) 
    } )
  }
  catch(error) {
    console.log(error)
  }
};

userSchema.statics.findUserByUsername = function(username) {
  try {
    return this.findOne( {username} )
    .then(user => {
      if (!user) {
        return null;
      }
      return user;
    });
  }
  catch (error) {
    console.log(error)
  }
}

userSchema.statics.checkUserExist = function(username) {
  try {
    return this.findOne( { username } )
    .then(user => {
      if (!user) {
        return null
      }
      return user;
    })
  }
  catch (error) {
    console.log(error)
  }
};

userSchema.statics.findUserRequest = function(id, _id) {
  try {
    return this.findOne({_id})
    .populate({
      path: "friend_requests",
      match: {
        _id: id,
      }
    }).select("friend_requests")
    .then((user) => {
      if (!user) {
        return null
      }
      return user
    });
  }
  catch (error) {
    console.log(error)
  }
};

userSchema.statics.deleteRequest = async function(userId, _id) {
  try {
    const requests = await this.findUserRequest(userId, _id);
    const findRequests = requests.friend_requests[0]._id
    return this.findOne({
    }).populate({
      path: "friend_requests",
      match: {
        _id: userId,
      },
    })
    .updateOne(
      { _id: _id },
      { $pull: { friend_requests: { $in: [findRequests] } } }
    ).then((result) => {
      return(result);
    });
  }
  catch (error) {
    console.log(error)
  }
}

userSchema.statics.findFriend = function(id, _id) {
  try {
    return this.findOne({_id})
    .populate({
      path: "friends",
      match: {
        _id: id,
      }
    }).select("friends")
    .then((user) => {
      if (!user) {
        return null
      }
      return user
    });
  }
  catch (error) {
    console.log(error)
  }
};

userSchema.statics.deleteFriend = async function(userId, _id) {
  try {
    const requests = await this.findFriend(userId, _id);
    const findRequests = requests.friends[0]._id
    return this.findOne({
    }).populate({
      path: "friends",
      match: {
        _id: userId,
      },
    })
    .updateOne(
      { _id: _id },
      { $pull: { friends: { $in: [findRequests] } } }
    ).then((result) => {
      return(result);
    });
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = mongoose.model('user', userSchema);
