const express = require('express');
const { use } = require('express/lib/application');
const app = express();
const User = require('./user.js')
const userRouter = require('./routerdata.js')

app.use(express.json());

app.use(userRouter);

app.use(express.static('../public')); // to import static files like css

app.listen(3000, () => {
    console.log('3000 is activated..');
});
