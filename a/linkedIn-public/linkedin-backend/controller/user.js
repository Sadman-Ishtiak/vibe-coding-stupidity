const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const NotificationModal = require('../models/notification')



const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: 'Lax' // set None in production

};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginThroghGmail = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;
        
        let userExist = await User.findOne({ email });
        if(!userExist){
            userExist = new User({ email, f_name: name, googleId: sub, profilePic: picture });
            await userExist.save();
        }

        let jwttoken = jwt.sign({ userId: userExist._id }, process.env.JWT_PRIVATE_KEY);
        res.cookie('token', jwttoken, cookieOptions);
        return res.status(200).json({ user: userExist });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

// Dev-only login to allow testing without Google OAuth.
// Enabled only when process.env.ENABLE_DEV_LOGIN === 'true'
exports.devLogin = async (req, res) => {
    try {
        if (process.env.ENABLE_DEV_LOGIN !== 'true') {
            return res.status(403).json({ error: 'Dev login disabled' });
        }

        const { email, f_name, profilePic } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email,
                f_name: f_name || 'Dev User',
                googleId: 'dev-login',
                profilePic: profilePic || undefined,
            });
            await user.save();
        }

        const jwttoken = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY);
        res.cookie('token', jwttoken, cookieOptions);
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.register = async (req, res) => {
    try {
        let { email, password, f_name } = req.body;
        let isUserExist = await User.findOne({ email });
        
        if(isUserExist){
            return res.status(400).json({ error: 'User already exist' });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const newUser = new User({ email, password: hashedPassword, f_name });
        
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully', success: "yes", data: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist && !userExist.password) {
            return res.status(400).json({ error: 'Please login through Google' });

        }
        
        if (!userExist) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        if (userExist && await bcryptjs.compare(password, userExist.password)) {
             const jwttoken = jwt.sign({ userId: userExist._id }, process.env.JWT_PRIVATE_KEY);
             res.cookie('token', jwttoken, cookieOptions);
             return res.status(200).json({ user: userExist, token: jwttoken });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { user } = req.body;
        const isExist = await User.findById(req.user._id);
        if (!isExist) {
            return res.status(400).json({ error: 'User Doesnt exist' });
        }
        
        Object.assign(isExist, user);
        await isExist.save();
        
        return res.status(200).json({ message: "User Updated", user: isExist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}



exports.logout = async (req, res) => {
    res.clearCookie('token', cookieOptions).json({ message: 'Logged out successfully' });
}


exports.findUser = async (req, res) => {
    try {
        let { query } = req.query;
        if (!query) return res.status(200).json({ message: "Fetched Member", users: [] });

        const users = await User.find({
            $and: [
                { _id: { $ne: req.user._id } },
                {
                    $or: [
                        { f_name: { $regex: query, $options: 'i' } },
                        { email: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        });
        return res.status(200).json({
            message: "Fetched Member",
            users: users
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.sendFriendRequest = async (req, res) => {
    try {
        const sender = req.user._id;
        const { reciever } = req.body;

        const userExist = await User.findById(reciever);
        if (!userExist) {
            return res.status(400).json({
                error: "No such user exist."
            });
        };
        const index = req.user.friends.findIndex(id => id.equals(reciever));
        
        if(index !== -1){
            return res.status(400).json({ error: "Already Friends" });
        }
        
        if(userExist.pending_friends.includes(sender)){
             return res.status(400).json({ error: "Request already sent" });
        }


        userExist.pending_friends.push(sender);
        await userExist.save();

        let content = `${req.user.f_name} has sent you friend request`;
        
        const notification = new NotificationModal({sender:sender,reciever:reciever,content,type:'friend_request'});
        await notification.save();

        res.status(200).json({
            message: "Friend Request Sent",
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}



exports.acceptFriendRequest = async (req, res) => {
    try {
        let { friendId } = req.body;
        let selfId = req.user._id;

        const friendData = await User.findById(friendId);
        if(!friendData){
             return res.status(400).json({ error: "User not found" });
        }

        const index = req.user.pending_friends.findIndex(id => id.equals(friendId));

        if (index !== -1) {
            req.user.pending_friends.splice(index, 1);
        } else {
            return res.status(400).json({
                error: "No any request from such user"
            })
        }

        req.user.friends.push(friendId);
        await req.user.save();

        friendData.friends.push(req.user._id);
        await friendData.save();

        let content = `${req.user.f_name} accepted your friend request`;
        const notification = new NotificationModal({sender:selfId,reciever:friendId,content,type:'friend_request_accepted'});
        await notification.save();

        return res.status(200).json({
            message: "You both are connected now."
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.getFriendsList = async (req, res) => {
    try {
        let user = await req.user.populate('friends');
        return res.status(200).json({ friends: user.friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}

exports.getPendingFriendList = async (req, res) => {
    try {
        let user = await req.user.populate('pending_friends');
        return res.status(200).json({ pending_friends: user.pending_friends });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}


exports.removeFromFriend = async (req, res) => {
    try {
        let selfId = req.user._id;
        let { friendId } = req.params;

        const friendData = await User.findById(friendId);
        if(!friendData) return res.status(404).json({error: "User not found"});

        const index = req.user.friends.findIndex(id => id.equals(friendId));

        if (index !== -1) {
            req.user.friends.splice(index, 1);
        } else {
            return res.status(400).json({
                error: "You are not friends with this user"
            })
        }
        
        const friendIndex = friendData.friends.findIndex(id => id.equals(selfId));
        if(friendIndex !== -1){
            friendData.friends.splice(friendIndex, 1);
        }

        await req.user.save();
        await friendData.save();
        return res.status(200).json({
            message: "You both are disconnected now."
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
}