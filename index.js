if (process.env.NODE_ENV !== 'production') 
    require('dotenv').config();


const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log("Connected"))
.catch(() => process.exit(-1));

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));

app.get('/*', (req, res) => {
    console.log("Routes not confirmed");
});

app.listen(process.env.PORT, ()=>console.log(`Server started on port ${process.env.PORT}`));