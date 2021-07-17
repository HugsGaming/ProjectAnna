const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const reportRouter = require('./routes/report.routes')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080

mongoose.connect(process.env.MONGODB_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result => {
    app.listen(port, () => {
        console.log(`Connected to the DB at port: ${port}`)
    });
})
.catch(e => console.error(`Unable to connect to the database, ${e}`));

app.set('view engine', 'ejs');

app.use(expressLayout);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.get('/', (req, res) => {
    res.render('index', {title: 'Home'});
});

app.get('/about', (req, res) => {
    res.render('about', {title: 'About Us'});
});

app.use('/reports', reportRouter);

app.use((req, res) => {
    res.status(404).render('404', {title: '404 Page'});
});
