$('document').ready(function (){

  $('.update').click(function(){
    var psw = prompt("password를 입력하세요");
    var id = $(this).data('id');

    alert(psw);

    $.ajax({
      url:'/posts/pswcheck/'+id,
      data:{psw:psw},
      type:'get',
      dataType:'json',
      success:function(data){
        if(data==="fail"){
          alert('비밀번호고 일치하지 않습니다');
        }else{
          alert(data);
          var url ='/posts/'+id+'/edit';
          $(location).attr('href',url);
        }
      }
    })

  })

    $('.delete').click(function(){
      var psw= prompt("password를 입력하세요");
      var id = $(this).data('id');
      var self = $(this);

    $.ajax({
        url:'/posts/delete/'+id,
        data:{psw:psw},
        type:'delete',
        dataType:'json',
        success:function(data){

          var $index = self.html("clicked: "+ event.target);
          $index.parent("td").parent("tr").empty();
          $('total').text($('total').text().split(' ')[0]-1+' posts');

          alert(data+'게시글이 삭제 되었습니다.');
        }
      })

    })


})
