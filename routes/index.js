var express = require('express');
var router = express.Router();
var po = require('../models/Post');

/* GET home page. */
router.get('/', function(req, res, next) { // 루트 경로로 들어왔을때 콘솔창에 db내용을 모두출력한다.
  po.find({},function(err,data){
    if(err){
      return next(err);
    }else{
      console.log(data);
      res.render('index', { title: 'Express' });
    }
  });
});



module.exports = router;
