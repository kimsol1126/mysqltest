var http = require('http');
var express = require('express');   //express 사용
var mysql = require('mysql');   //mysql DB 사용
const { query } = require('express');   //쿼리문을 위한 express 연동
var app = express();    //express 함수를 app 으로 간소화
app.engine('html', require('ejs').renderFile);  //views 폴더 내부의 html 파일을 사용하기 위한 ejs 연동
app.set('view engine', 'ejs');

//DB연동
var client = mysql.createConnection({
        user : 'root',
        password : '1111',
        database : 'Company'
});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
//app.use(app.router);

//http://127.0.0.1:52273 서버 접속 시 초기 화면에 example.html이 렌더링되도록 함
app.get('/',function(request,response){
    response.render('example.html');
});

//example.html 17라인의 $.getJSON('http://127.0.0.1:52273/products' 를 의미한다. 해당 링크에는 배열 형태로 db 출력이 이루어진다. 
app.get('/products', function(request, response){
    client.query('SELECT * FROM products', function(err,data){
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data); //send()는 해당 페이지에 출력을 담당. query로 받아온 data를 출력한다.
    });
});

//지정한 id에 따라 DB에 다른 쿼리를 날리는 구문 
app.get('/:id', function(request, response){
    var id = Number(request.param('id'));
    client.query('SELECT * FROM products WHERE id=?', [id], function (error, data) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data);
        });
});

//products Json 페이지에서 DB 내부에 입력을 할 수 있도록 함
app.post('/products', function (request, response) {
    //변수를 선언합니다.
    var name = request.param('name');
    var modelnumber = request.param('modelnumber');
    var series = request.param('series');
    
    //데이터베이스 요청을 수행합니다.
    client.query('INSERT INTO products(name, modelnumber, series) VALUES(?,?,?)', [name, modelnumber, series], function (error, data) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send({
            message: '데이터를 추가했습니다.',
        });
    });
});

//특정 id에 대하여 정보 업데이트 수행
app.put('/products/:id', function (request, response) {
    //변수를 선언합니다.
    var id = Number(request.param('id'));
    var name = request.param('name');
    var modelnumber = request.param('modelnumber');
    var series = request.param('series');
    var query = 'UPDATE products SET';

    //쿼리를 생성합니다.
    if (name)
        query += 'name="' + name + '" ';
    if (modelnumber)
        query += 'modelumber="' + modelnumber + '" ';
    if (series)
        query += 'series="' + series + '" ';

    //데이터베이스 요청을 수행합니다.
    client.query(query, function (error, data) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data);
    });
});

//특정 id에 대한 DB 정보 삭제
app.del('http://127.0.0.1:52273/products/:id', function (request, response) {
    //변수를 선언합니다.
    var id = Number(request.param('id'));

    //데이터베이스 요청을 수행합니다.
    client.query(query, function (error, data) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data);
    });
});

//웹서버를 실행
http.createServer(app).listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});
