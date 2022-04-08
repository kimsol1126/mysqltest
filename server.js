var http = require('http');
var express = require('express');
var mysql = require('mysql');
const { query } = require('express');
var app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

var client = mysql.createConnection({
        user : 'root',
        password : '1111',
        database : 'Company'
    });

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//app.use(app.router);


app.get('/',function(request,response){
    response.render('example.html');
});

app.get('/products', function(request, response){
    client.query('SELECT * FROM products', function(err,data){
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data);
    });
});

app.get('/:id', function(request, response){
    var id = Number(request.param('id'));
    client.query('SELECT * FROM products WHERE id=?', [id], function (error, data) {
        response.set('Access-Control-Allow-Origin', '*');
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
        response.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
        response.send(data);
        });
});

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

app.put('/products/:id', function (request, response) {
    //변수를 선언합니다.
    var id = Number(request.param('id'));
    var name = request.param('name');
    var modelnumber = request.param('modelnumber');
    var series = request.param('series');
    var query = 'UPDATA products SET';

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
