var express = require('express');
var po = require('../models/Post');
var router = express.Router();

//게시판 기능
/*
 * 글 쓰기
    get 페이지 띄우기
    post 데이터 저장
 * 글 보기
    get 페이지 띄우기 -> read+1 update
 * 글 수정
    get 페이지 띄우기 -> 비밀번호 확인
    put 데이터 수정
 * 글 삭제
   delete 삭제 -> 비밀번호 확인
*/

router.get('/', function(req, res, next) {  // /posts로 들어왔을 경우

  po.find({},function(err,data){ //모든 데이터 ㅊ출
    if(err){
      return next(err); //에러났을경우 에러 핸들러로 next시킴
    }else{
      var pagination={ "numPosts" :data.length}; //data(게시글 수)
      res.render('./posts/index', { posts: data,  pagination : pagination }); //게시글의 데이터와 갯수를 랜더링한다.
    }
  });

});
router.get('/new', function(req, res, next) { // /poset/new로 들어왔을 경우 글쓰기 페이지 전환
      res.render('./posts/edit', { post: ''}); //글쓰기 페이지를 렌더링 한다.
});
router.post('/', function(req, res, next) { // 글쓰기 완료버튼을 눌렀을 경우 post 요청을 한다.

  var post = new po({  //글쓰기에서 넘어온 데이터를 body에서 추출하여 po스크마에 맞게 데이터를 넣어준다.
       email: req.body.email,
       password: req.body.password,
       title: req.body.title,
       content: req.body.content,
       read:'0'
   });

   console.log(post);
 post.save(function (err) { //데이터를 db애 저장한다.
    if (err) {
        return next(err); //에러났을경우 에러 핸들러로 next시킴
    } else {
        res.redirect('/posts'); //저장후 /posts경로로 이동한다.
    }
  });
});

router.get('/:id/edit',function(req,res,next){ //수정 페이지 전환
  var id = req.param('id'); //url에 있는 id값을 추출한다.

  po.findOne({_id:id},function(err,data){ //db안에 있는 _id에서 id값과 일치하는 데이터를 찾는다.
    if(err){
      return next(err); //에러났을경우 에러 핸들러로 next시킴
    }else{
      res.render('./posts/edit', { post: data}); //id값에 해당하는 데이터들을 렌더링한다.
    }
  });

});

router.put('/:id',function(req,res,next){ //글 수정
/* 데이터 추출 부분*/
  var id = req.param('id');
  var email =req.body.email;
  var password= req.body.password;
  var title= req.body.title;
  var content= req.body.content;


  po.findOne({_id:id},function(err,data){ //id와 일치하는 데이터를찾는다.
    if(err){
      return next(err); //에러났을경우 에러 핸들러로 next시킴
    }else{
      po.update({_id:id},{email: email, password: password, title:title, content:content},function(err){ //찾은 데이터를 수정할 데이터로 update해준다.
        if(err){
          return next(err);//에러났을경우 에러 핸들러로 next시킴
        }else{
          res.redirect('/posts'); //저장후 /posts경로로 이동한다.
        }
      });
    }
  });
});

router.delete('/delete/:id',function(req,res,next){ //삭제
/* 데이터 추출 부분*/
  var psw= req.body.psw;
  var id = req.param('id');

  po.findOne({_id:id},function(err,data){ //id와 일치하는 _id를 찾는다
    if(err){ return next(err); }//에러났을경우 에러 핸들러로 next시킴
    else{
      if(data.password===psw){ //넘어온 psw와 저장되있던 psw가 일치하면
        po.remove({_id:id},function(err){ // 삭제를 시킨다
          if(err){
            return next(err); //에러났을경우 에러 핸들러로 next시킴
          }else{
            console.log(data);
            res.json(data.email); //data.email을 날린다.
          }
        });
      }
    }
  });

});

router.get('/:id',function(req,res,next){ //게시글 보기
  var id = req.param('id');

  po.findOne({_id:id},function(err,data){
    if(err){
      return next(err); //에러났을경우 에러 핸들러로 next시킴
    }else{
      var c = data.read; //게시글의 읽은 겟수를 가져온다
      c++; //읽은 겟수 1증가
      po.update({_id:id},{read:c},function(err){ // 게시글을 볼 때마다 읽은 횟수를 증가 시키나.
        if(err){
          return next(err); //에러났을경우 에러 핸들러로 next시킴
        }else{
          console.log(data);
          res.render('./posts/show', { post: data}); // 읽은 겟수를 업데이트한 data를 렌더링한다.
        }
      });
    }
  });
});

router.get('/pswcheck/:id',function(req,res,next){ //비밀번호가 일치한지 찾는 부분이다.
  var id = req.param('id');
  var psw = req.query.psw; //이부분은 왜 query로 받아야 하는지 이해가 되지 않습니다. body와 query의 정확한 차이를 모르겠습니다.

  po.findOne({_id:id},function(err,data){
    if(err){
      return next(err); //에러났을경우 에러 핸들러로 next시킴
    }else{
      if(data.password===psw){ //비밀번호가 일치하면 추출한 data들을 전송한다.
        res.json(data);
      }else{ //비밀번호가 일치하지 않으면 fail을 보낸다.
        res.json('fail');
      }
    }

  });

});

module.exports = router;
