function ClientData(Id, Name, Socket)
{
    this.m_Id=Id;
    this.m_Name=Name;
	this.m_Socket=Socket;
	this.m_Position="0.0, 0.0, 0.0";
}

var m_ClientsData=[];
var io=require('socket.io')(1234);
console.log('Kaneda Games Multiplayer Server Initialized');

io.on('connection', function(socket) {
	
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
});
