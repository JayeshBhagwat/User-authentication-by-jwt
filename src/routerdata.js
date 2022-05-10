const express = require('express')
const router = new express.Router()
const User = require('./user')
const app = express();
const Isemail = require('isemail');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const CryptoJS = require("crypto-js");
let key = "iprogrammer";
let TOKEN_KEY = 'jayesh';




router.post('/register', (req, res) => {
    const { role, username, email, password} = req.body;
    console.log('R-Data --',role,  username, email, password)

    if (Isemail.validate(email)){
        let cipher = CryptoJS.AES.encrypt(password, key);
        cipher = cipher.toString();

            const Obj = new User({
                role : role,
                username: username,
                email: email,
                password: cipher
            })

            if(role == 'free'){
                const token = jwt.sign({ email }, TOKEN_KEY,{
                        expiresIn: "1 Minutes",
                    });
                Obj.token = token;
                Obj.save().then(() => {
                    console.log('Success : ', Obj)
                }).catch((error) => {
                    console.log("Reject : ", error)
                })
                res.send(true)
            } else if (role == 'basic') {
                const token = jwt.sign({ email }, TOKEN_KEY, {
                    expiresIn: "2 Minutes",
                });
                Obj.token = token;
                Obj.save().then(() => {
                    console.log('Success : ', Obj)
                }).catch((error) => {
                    console.log("Reject : ", error)
                })
                res.send(true)
            } else if (role == 'premium') {
                const token = jwt.sign({ email }, TOKEN_KEY, {
                    expiresIn: "3 Minutes",
                });
                Obj.token = token;
                Obj.save().then(() => {
                    console.log('Success : ', Obj)
                }).catch((error) => {
                    console.log("Reject : ", error)
                })
                res.send(true)
            }

    }else{
        res.send(false);
    }
});




router.post('/login',(req, res) => {
    const { email, password } = req.body;
    console.log('L-Data --', email, password)
    // const Obj = new User()

    User.find({email:email}, function (error, docs) {
        console.log('my docs',docs)
        if (docs == null || docs.length < 1) {
            console.log('User Not Found')
            res.send({user_value:false})
        }else{
            let data = CryptoJS.AES.decrypt(docs[0].password, key);
            data= data.toString(CryptoJS.enc.Utf8);
            // console.log('decrypted pass ',data);

            if(docs[0].email == email && data == password){
                // console.log('valied user you are')
                // res.send(true , docs[0].username)
                // res.send({val: true, myuser: docs[0].username })
                try {
                    const result = jwt.verify(docs[0].token, TOKEN_KEY);
                    console.log('Result from token -> ', result)
                    console.log('Valid Token');
                    res.send({ val: true, myuser: docs[0].username, id: docs[0]._id, data: result, role: docs[0].role})
                    
                } catch (err) {
                    console.log('Plan Expired..(Invalid token)');
                    const token = jwt.sign({ email }, TOKEN_KEY, {
                        expiresIn: "1 Minutes",
                    });
                    User.findOneAndUpdate({ email: email }, { token: token, role: 'free' }, function (error, result) {
                        // 
                    })
                    // User.findOneAndUpdate({email: email }, { role: 'free' });
                    console.log('Plan switched to FREE TRIAL..')
                    res.send({ val: false, myuser: docs[0].username, id: docs[0]._id});
                }
            }else{
                console.log('Wrong Credentials')
                res.send(false)
            }
        }
    })

});





// router.post('/upgrade',(req,res)=>{
//     const {email, plan, id} = req.body;

//     User.find({ _id: id }, function (error, docs) {
//         if (docs == null || docs.length < 1) {
//             console.log('NO USER FOUND TO UPGRADE...')
//             res.send({ user_value: false })
//         }else {

//             const token = jwt.sign({ email }, TOKEN_KEY, {
//                 expiresIn: plan + "Minutes",
//             })

//             User.findOneAndUpdate({ _id: id, email: email }, { token: token }, function (error, result) {
//                 if (error) {
//                     console.log('NO ID FOUND!!!');
//                     // res.send(false);
//                 }else {
//                     console.log('ID FOUND');
//                     // res.send(true);
//                 }
//             })
//         }
//     })
// });


router.post('/upgrade', (req, res) => {
    const { email, role, id } = req.body;
    console.log('UPGRADE TO role-> ',role);
    if(role == 'basic'){
        const token = jwt.sign({ email }, TOKEN_KEY, {
            expiresIn: "2m",
        });
        User.findOneAndUpdate({ _id: id, email: email }, { token: token, role: role }, function (error, result) {
            console.log('Result from update ', result)
            if (error) {
                console.log('NO ID FOUND to Upgrade!!!');
                res.send(false);
            } else {
                console.log('ID FOUND to Upgrade');
                res.send({ val: true, role: result.role });
            }
        })
    } else if (role == 'premium') {
        const token = jwt.sign({ email }, TOKEN_KEY, {
            expiresIn: "3m",
        });
        User.findOneAndUpdate({ _id: id, email: email }, { token: token, role: role }, function (error, result) {
            console.log('Result from update ', result)
            if (error) {
                console.log('NO ID FOUND to Upgrade!!!');
                res.send(false);
            } else {
                console.log('ID FOUND to Upgrade');
                res.send({ val: true, role: result.role });
            }
        })
    }

    // console.log('this is client request -> ',req.body)
})

module.exports = router