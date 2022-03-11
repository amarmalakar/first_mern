const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
var bcrypt = require('bcryptjs');
const Authenticate = require("../middleware/authentication");

router.get('/', (req, res) => {
    res.send('Hello from auth route');
})

// {
//     "name": "amar",
//     "email": "amar@gmail.com",
//     "phone": "9876543210",
//     "work": "web dev",
//     "password": "12345678",
//     "cpassword": "12345678"
// }

router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ success: false, error: "Plz fill the field properly" })
    }

    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(422).json({ success: false, error: 'Email Already Exists!' })
        } else if (password != cpassword) {
            return res.status(422).json({ success: false, error: 'Enter Same Password' })
        } else {
            const user = new User({ name, email, phone, work, password, cpassword });
            const userRegister = await user.save();

            if (userRegister) {
                return res.status(201).json({ success: true, message: 'user register successfully', data: user })
            } else {
                return res.status(500).json({ success: false, message: 'Failed to register' })
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ success: false, error: "Plz fill the field properly" })
        }

        const userLogin = await User.findOne({ email });

        if (!userLogin) {
            return res.status(422).json({ success: false, error: 'Invalid Credentials!' });
        }

        const isMatch = await bcrypt.compare(password, userLogin.password);

        if (!isMatch) {
            return res.status(422).json({ success: false, error: 'Invalid Credentials!' });
        } else {
            const token = await userLogin.generateAuthToken();
            // console.log(token);

            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            })

            return res.status(200).json({ success: true, message: 'user signin successfully!' });
        }
        
    } catch (error) {
        console.log(error);
    }
})

router.get('/about', Authenticate, (req, res) => {
    res.send(req.rootUser)
})

router.get('/getdata', Authenticate, (req, res) => {
    res.send(req.rootUser)
})

router.post('/contact', Authenticate, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            res.json({ success: false, message: 'plzz fill the contact form' })
        }
        
        const userContact = await User.findOne({ _id: req.userID });

        if (userContact) {
            const userMessage = await userContact.addMessage(name, email, phone, message);
            await userContact.save()
            res.status(201).json({ success: true, message: "user contact successfully!" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/' })
    res.status(200).send('User Logout')
})

module.exports = router;