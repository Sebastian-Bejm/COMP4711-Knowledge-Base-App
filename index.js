const express = require('express')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname,'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())

const expressHbs = require('express-handlebars');
app.engine(
    'hbs',
    expressHbs({
      layoutsDir: 'views/layouts/',
      defaultLayout: 'main-layout',
      extname: 'hbs'
    })
);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(session({
    secret:'superdupersecretkeynooneknows',// used to encrypt/sign the session id
    resave: false,
    saveUninitialized: true
}));


let userRoutes = require('./routes/user');
let postRoutes = require('./routes/post');
let messageRoutes = require('./routes/message');

app.use(userRoutes);
app.use(postRoutes);
app.use(messageRoutes);


app.get("/", (req,res)=>{
  res.render("homepage", {homeCSS: true});
})

app.listen(PORT, () => console.log('Server listening on port '+PORT))



