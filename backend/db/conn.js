const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE).then((db) => {
    console.log('Server is connected with db');
})
.catch((err) => {
    console.log(err);
})