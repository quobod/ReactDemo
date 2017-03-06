var express = require('express');
var router = express.Router();

// index view
router.get('/', function(req, res){
	res.render('index',{title:'Account Manager',admin:false});
});

// about view
router.get('/about', function(req, res){
	res.render('about',{title:'About',admin:false});
});

// contact view
router.get('/contact', function(req, res){
	res.render('contact',{title:'Contact',admin:false});
});

module.exports = router;