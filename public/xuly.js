var socket = io("http://noichuyen.herokuapp.com/");
$(document).ready(function(){
	$("#login").show();
	$("#chatroom").hide();

	$("#btnRegister").click(function(){
		socket.emit("client-resgiter",$("#inputRegisterContent").val());
	});

	$("#btnLogout").click(function(){
		socket.emit("client-request-logout");
		$("#login").show();
		$("#chatroom").hide();
	});

	$("#inputUserMessage").focusin(function(){
		socket.emit("i-am-typing","true");
	});

	$("#inputUserMessage").focusout(function(){
		socket.emit("i-am-typing","false");
	});

	$("#btnSend").click(function(){
		socket.emit("client-send-message-to-all",$("#inputUserMessage").val());
	});

	socket.on("server-notice-register-success",function(data){
		$("#userActived").text(data);	
		$("#login").hide();
		$("#chatroom").show();			
	});

	socket.on("someone-is-typing",function(data){
		if(data != ""){
			//Co nguoi dang go chu
			$("#notice-someone-is-typing").html(data+" is typing "+"<img id='img-typing' src='typing.gif'/>");
		}else{
			//Khong co ai go chu
			$("#notice-someone-is-typing").html("");
		}		
	})

	socket.on("server-request-update-list-people-online",function(data){
		$("#tableUserLogined").html("");
		for(var i= (data.length-1); i >= 0; i--){
			if(i == data.length-10) break;
			else if(i == data.length-1){				
				$("#tableUserLogined").prepend("<tr><td>"+data[i]+"</tr></td><br>");
			}
			else{
				$("#tableUserLogined").prepend("<tr><td>"+data[i]+"</tr></td>");
			}
		}
	});

	socket.on("server-request-send-message-content",function(data){
		$("#chat-area-content").append("\n"+data.username+": "+data.content);
		//roll to the newest
		var textarea = document.getElementById('chat-area-content');
		textarea.scrollTop = textarea.scrollHeight;
	});

	socket.on("server-notice-register-fail",function(data){
		alert("Username is existed.");
	});
});