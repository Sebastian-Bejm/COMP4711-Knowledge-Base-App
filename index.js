const express = require('express')
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const PORT = process.env.PORT || 5000

const sanit = require("./util/sanit");

app.use(express.static(path.join(__dirname,'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use(expressSanitizer());
app.use(sanit);

const expressHbs = require('express-handlebars');

app.engine(
    'hbs',
    expressHbs({
      layoutsDir: 'views/layouts/',
      defaultLayout: 'main-layout',
      extname: 'hbs',
      helpers: {
        foo: function () { console.log('FOO!'); },
        bar: function () { return 'BAR!'; },
        ifEquals: function(arg1, arg2, options) {
          return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
        },
        ifNotEquals: function(arg1, arg2, options) {
          return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
        }
    }
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
  req.session.errors = req.session.errors ? req.session.errors : {}; 
  req.session.newUser = req.session.newUser ? req.session.newUser : {}; 
  res.render("homepage", {homeCSS: true, newUser: req.session.newUser, errors: req.session.errors});
})

app.listen(PORT, () => console.log('Server listening on port '+PORT))



