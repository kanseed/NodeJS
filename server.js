var app=require("espress")();
var http=require("http").Server(app);
var io=require("socket.io")(http)

var cc       = require('config-multipaas'),
    finalhandler= require('finalhandler'),
    http     = require("http"),
    Router       = require('router'),
    fs = require('fs'),
    serveStatic       = require("serve-static");

var config   = cc();
var app      = Router()

var port=process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip=process.env.OPENSHIFT_NODEJS_IP || 8080;
http.listen(port, ip, function(){
	console.log("demo start success!!!!");
})

function ClientData(Id, Name, Socket)
{
    this.m_Id=Id;
    this.m_Name=Name;
	this.m_Socket=Socket;
	this.m_Position="0.0, 0.0, 0.0";
}

var m_ClientsData=[];
//var io=require('socket.io')(1234);
 console.log('Kaneda Games Multiplayer Server Initialized');

// Serve up public/ftp folder 
app.use(serveStatic('static'))

var os=require('os');
var networkInterfaces=os.networkInterfaces( );
console.log("ip "+networkInterfaces);



function getServerIp() {

  var os = require('os');
  var ifaces = os.networkInterfaces();
  var values = Object.keys(ifaces).map(function(name) {
    return ifaces[name];
  });
  values = [].concat.apply([], values).filter(function(val){ 
    return val.family == 'IPv4' && val.internal == false; 
  });

  return values.length ? values[0].address : '0.0.0.0';
}

console.log("ip address "+getServerIp());

console.log("end");



// Routes
app.get("/status", function (req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end("{status: 'ok'}\n")
})

app.get("/", function (req, res) {
	console.log( "home");
  var index = fs.readFileSync(__dirname + '/index.html')
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(index.toString())
})

// Create server 
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  app(req, res, done)
})

server.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});

io.on('connection', function(socket) {
	console.log('user connected by socket!');
});

/*io.on('connection', function(socket) {
	
	var m_CurrentClient;
	
	m_CurrentClient=socket;
	
	for(i=0;i<m_ClientsData.length;++i)
	{
		m_ClientsData[i].m_Socket.emit('CreateClient', {
			id : m_ClientsData.length,
		})
	}

	var l_ClientData=new ClientData(m_ClientsData.length, '', socket)
	m_ClientsData.push(l_ClientData);
	
	console.log('New client '+l_ClientData.m_Id);
	
	socket.on('disconnect', function() {
		console.log('User disconnected!');

		var l_ClientId=m_ClientsData.indexOf(socket);
		m_ClientsData.splice(l_ClientId, 1);
	});
	
	socket.emit('SetIdClient', {
		id : l_ClientData.m_Id,
	})
	
	
	for(i=0;i<m_ClientsData.length;++i)
	{
		socket.emit('CreateClient', {
			id : m_ClientsData[i].m_Id,
		})
	}
	socket.on('ping', function (data) {
		console.log('user ping');
	})
	socket.on('SetTransform', function (data) {
		var l_Id=parseInt(data.id);
		if(l_Id>=0 && l_Id<m_ClientsData.length)
		{
			m_ClientsData[l_Id].m_Position=data.position;
			//console.log('SetTransform '+data.position);
			for(i=0;i<m_ClientsData.length;++i)
			{
				if(m_ClientsData[i].m_Socket!=m_CurrentClient)
				{
					//console.log('send data from '+l_Id+" to "+m_ClientsData[i].m_Id);
					m_ClientsData[i].m_Socket.emit('SetTransform', {
						id : l_Id,
						position : data.position,
					})
				}
			}
		}
	})
});*/
