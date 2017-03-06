var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var filter = require('../modules/string-search');
var editor = require('../modules/string-utils');
var timeParts = require('timeparts');

var csrfProtection = csrf();
// router.use(csrfProtection);

const NodeCouchDb = require('node-couchdb');
const authorization = {
    auth: {
        user:'profmin',
        password:'02468'
    }
};
const dbName = "myaccounts";
const viewUrl = '_design/full_list/_view/new-view';
const couch = new NodeCouchDb(authorization);

couch.listDatabases().then(function(dbs){
    console.log('\n\n\t\tMy Databases');
    for (var d in dbs) {
        console.log((parseInt(d) + 1) + ': ' + dbs[d]);
    }
    console.log('\t\tend of list\n');
});
	
router.get('/profile', isLoggedIn, function(req, res, next){
    var hour = timeParts().hour;
    var timeofday = '';
    
    if (hour >= 00 && hour <= '11') {
        timeofday = 'Good Morning ';
    } else if (hour >= 12 && hour <= 17) {
        timeofday = 'Good Afternoon ';
    } else {
        timeofday = 'Good Evening ';
    }
    
    console.log(hour);
    const greet = timeofday + req.user.fname;
    const user = req.user;
    res.render('user/profile',{title:'Profile', greeting:greet, user:user, admin:false});
});

router.get('/accounts', isLoggedIn, function(req, res, next) {
    couch.get(dbName, viewUrl).then(
    function(data, headers, status) {
        res.render('user/accounts',{
            accounts: data.data.rows,
            title: editor.cfc('account manager demo'),
            admin: false
        });
    },
    function(err){
        res.send(err);
    });
});

router.get('/account/:id', function(req, res, next){
    var id = req.params.id.toString();
    console.log("Record Id: " + id);
    //* 
    couch.get(dbName, req.params.id).then(({data, headers, status}) => {
        res.render('user/account', {account:data, title:'Account', admin:false});
    }, err => {
        res.redirect('/user/accounts');
    });//*/
});

router.post('/search', isLoggedIn, csrfProtection, function(req, res){
    const keyword = req.body.keyword;
    const results = [];
    couch.get(dbName, viewUrl).then(
    function(data, headers, status) {
       for (var d in data.data.rows) {
           var profile = data.data.rows[d];
           if (profile.value.title.trim().toLowerCase() === keyword.trim().toLowerCase() ||
               profile.value.email.trim().toLowerCase() === keyword.trim().toLowerCase() ||
               profile.value.login.trim().toLowerCase() === keyword.trim().toLowerCase()) {
                   results.push(profile);
               }
       }       
       if (results.length > 0) {
           res.render('searched',{results:results,title:'Search Results'});
       } else {
           res.redirect('/');
       }
    },
    function(err){
        res.send(err);
    });    
});

router.get('/add', isLoggedIn, csrfProtection, function(req, res){
    res.render('user/add',{title:editor.cfc('new profile'), csrfToken: req.csrfToken, admin:false});
});

router.post('/add', isLoggedIn, function(req, res){
	var uname = editor.cfc(req.body.username),
		org = editor.cfc(req.body.org),
		site = (!filter.http(req.body.site))?'http://' + req.body.site:req.body.site,
		pwd = req.body.password,
		email = editor.cfc(req.body.email);
    const data = [];    
    for (var p in req.body) {
        if (p !== 'org' && p !== '_csrf' && p !== 'password' && p !== 'site' && p !== 'email' && p !== 'id' && p !== 'username' && p !== 'rev') {
            var objP = req.body[p];
            if (objP) {
                data.push({key:editor.cfc(p),value:objP});
            }
        }
    }      
    //*
    console.log('\n\n\t\t\t\tAdding ' + uname + ' Profile at ' + site);
    console.log('\tUsername: ' + uname);
    console.log('\tOrganization: ' + org);
    console.log('\tSite: ' + site);
    console.log('\tPassword: ' + pwd);
    console.log('\tEmail: ' + email);
    for (var d in data) {
        var objD = data[d];
        if (objD instanceof Object) {
            for(var x in objD) {
                var objX = objD[x];
                console.log(editor.cfc(x) + ': ' + objX);
            }
        }
    }
    console.log('\t\t\t\tThe End\n\n');//*/
    
    //*
    couch.uniqid().then(function(ids){
        const id = ids[0];        
        couch.insert(dbName, {
        _id:id,
        organization:org,
        site:site,
        username:uname,
        password:pwd,
        email:email,
        extra:data
        }).then(function(data, headers, status){
            res.redirect('/user/accounts');
        },
        function(err){
            console.log(err);
        });
    });//*/
});

router.post('/edit', isLoggedIn, function(req, res){
	var id = req.body.id,
        rev = req.body.rev,
		uname = editor.cfc(req.body.username),
		org = editor.cfc(req.body.organization),
		site = (!filter.http(req.body.site))?'http://' + req.body.site:req.body.site,
		pwd = req.body.password,
		email = editor.cfc(req.body.email);
    var data = [];
    for (let p in req.body) {
        if (p !== 'organization' && p !== 'username' && p !== 'email' && p !== 'password' && p !== 'site' && p !== '_csrf' && p !== 'id' && p !== 'rev') {
            var objP = req.body[p];
            if (objP) {
                let value = objP;
                data.push({key:editor.cfc(p),value:objP});
            }
        }
    }    
       
    /*
    console.log('\n\n\t\t\t\tEditing ' + uname + ' Profile at ' + site);
    console.log('\tID: ' + id);
    console.log('\tRev: ' + rev);
    console.log('\tUsername: ' + uname);
    console.log('\tOrganization: ' + org);
    console.log('\tSite: ' + site);
    console.log('\tPassword: ' + pwd);
    console.log('\tEmail: ' + email);    
    console.log('\t\t\t\tThe End\n\n');//*/
    // res.sendStatus(200);
    
    //*
    couch.update(dbName, {
        _id:id,
        _rev:rev,
        organization:org,
        site:site,
        username:uname,
        password:pwd,
        email:email,
        extra:data
    }).then(({data, headers, status}) => {
        res.redirect('/user/accounts');
    }, err => {
        console.log(err);
    });//*/    
});

router.delete('/delete/:id', isLoggedIn, function(req, res){
	var id = new String(req.params.id).split(':')[0];
    var rev = new String(req.params.id).split(':')[1];
    // console.log('Deleting id: ' + id + '\trev: ' + rev);
    // res.sendStatus(200);
    //*
    couch.del(dbName, id, rev).then(({data, headers, status}) => {        
        res.sendStatus(200);
    }, err => {
        console.log(err);
    });//*/
});

router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', csrfProtection, function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {title:'Registration', csrfToken: req.csrfToken(), messages:messages, hasErrors: messages.length > 0, isAdmin:false, admin:false});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', csrfProtection, function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signin', {title:'Sign In', csrfToken: req.csrfToken(),messages:messages, hasErrors: messages.length > 0, isAdmin:false, admin:false});
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/accounts',
    failureRedirect: '/user/signin',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
