var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.set("views",__dirname + "/views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var arrayUserLogined = [""];

io.on("connection",function(socket){
	console.log("[CONNECTION] "+socket.id+ " connect to server");

	//User register
	socket.on("client-resgiter",function(data){
		if(arrayUserLogined.indexOf(data) == -1){
			//Register success
			console.log("[RESGISTER] "+data + " resgister success");
			arrayUserLogined.push(data);
			socket.Username = data;
			socket.emit("server-notice-register-success",socket.Username);
			io.sockets.emit("server-request-update-list-people-online",arrayUserLogined);
		}else{
			//Register fail
			console.log("[RESGISTER] "+data + " resgister fail");
			socket.emit("server-notice-register-fail");
		}
	});

	//User send message
	socket.on("client-send-message-to-all",function(data){
		io.sockets.emit("server-request-send-message-content",{username:socket.Username, content:data});
	});

	//User is typing
	socket.on("i-am-typing",function(data){
		if(data == "true"){
			socket.broadcast.emit("someone-is-typing",socket.Username);
		}else{
			socket.broadcast.emit("someone-is-typing","");
		}		
	});

	//User logout
	socket.on("client-request-logout",function(){
		//Delete array and update client
		console.log("[LOGOUT] "+socket.Username+" logout ("+socket.id+")");
		arrayUserLogined.splice(arrayUserLogined.indexOf(socket.Username),1);		
		io.sockets.emit("server-request-update-list-people-online",arrayUserLogined);
		
	});

	//Socket disconnect
	socket.on("disconnect",function(){
		console.log("[DISCONNECT] "+socket.Username+" disconnected ("+socket.id+")");
	})
});
app.get("/",function(req,res){
	res.render("trangchu");
});
