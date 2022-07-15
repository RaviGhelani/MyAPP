//Initial
var socket = io(); //Instance of io sockets
//********** ON CLIENT CONNECT
socket.on('connect', function() { //'connect' is built in
	console.log('Connected to server');
	// Extract the 'FORM' variables from the url into JSON format:
	var loginFormParams = jQuery.deparam(window.location.search);
	loginFormParams.room = loginFormParams.room.toUpperCase(); // Standardize to Uppercase rooms only
	//console.log(loginFormParams.room);
	//ADD THE UPPERCASE STUFF HERE FOR THE ROOM
	//3A Client ==> Server
	//Initial Join chat room
	socket.emit('join', loginFormParams, function(err) { // The function is the ACK
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
		jQuery('#roomname').html('<h3>\"' + loginFormParams.room + '\"</h3>'); // Add the name of the room
	});
});

//*********** ON CLIENT DISCONNECT
socket.on('disconnect', function() { //'disconnect is built in'
	console.log('Disconnected from server');
});

//ON UPDATE USER LIST IN ROOM
// CLIENT <== SERVER update users in room
// Here we update the display of users in the room
socket.on('updateUserList', function(users) {
	console.log('users list', users);

	var ol = jQuery('<ol></ol>'); // construct the html Ordered list

	users.forEach(function(user) { // Iterate through the users list supplied
		ol.append(jQuery('<li></li>').text(user)); // add each user to a  the <ol> <li>user1</li> <li>user1</li> </ol> tag to make the ordrered list
	});

	// Now we have to display to the DOM the new ordered html list we just created
	jQuery('#users').html(ol);



});

//ON NEW MESSAGE FROM OTHER CLIENTS
// 1C CLIENT((newMessage) <== SERVER(newMessage)
//you can type at the consol dev tool of browser : socket.emit('createMessage', {from: 'julie', text: 'hi there'});
socket.on('newMessage', function(message) {

	// JQuery refers to the content of the content of the <script>
	// tag and .html() gives the html code to template
	var template = jQuery('#messagelist-template').html();
	//console.log('template', template);
	// Insert the data into the template:
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: message.createdAt
	});
	//console.log('html', html);
	// actuall add it to the messageList
	jQuery('#messagelist').append(html);
	scrollToBottom(); //Scrolls down only wehn you are at the bottom
	// //var formattedTime = moment(message.createdAt).format('h:mm a');
	// //console.log('New Message:', message);
	// var dd = jQuery('<dd></dd>'); // set up an unordered list tag
	// dd.text(`${message.from} ${message.createdAt}: ${message.text}`); //Add the data to it
	//
	// jQuery('#messagelist').append(dd); // append it to the html and Display it
});

// ON NEW LOCATION FROM OTHER CLIENTS
// 2C CLIENT(newLocationMessage) <== SERVER(newLocationMessage)
socket.on('newLocationMessage', function(message) {
	//read the template from index.html
	console.log('Message from server', message);
	var template = jQuery('#location-messagelist-template').html();
	// Insert the data into the template:
	var html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: message.createdAt
	});
	//console.log('html', html);
	// actuall add it to the messageList
	console.log(html);
	jQuery('#messagelist').append(html);
	scrollToBottom(); //Scrolls down only wehn you are at the bottom
});



// ON SUBMIT A NEW MESSAGE
// 1A CLIENT(createMessage) ==> SERVER(createmessage)
//**************** emiting a message to the server
// Disable the standard FORM behaviour and on click:
jQuery('#message-form').on('submit', function(e) {
	e.preventDefault(); //
	var messageTextbox = jQuery('[name=message]'); // load the actual field data

	//on click:
	socket.emit('createMessage', {
		//from: 'User',
		text: messageTextbox.val() // Send the actual text
	}, function() { // Acknowledge receipt from the server function
		messageTextbox.val(''); // Clear the message form field after submision
	});
});

// ON SUBMIT CREATE NEW LOCATION
// 2A CLIENT(createLocationMessage) ==> SERVER(createLocationMessage)
//**************** Pressing and sending location info to the server
var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
	console.log('Click');
	if (!navigator.geolocation) { // if there is no built in navigator in your broswer
		return alert('Geolocation not supported by you browser.');
	}
	//the disabled attribute is set to dissabled and disables the button
	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function(position) {
		locationButton.removeAttr('disabled').text('Send location'); // Re-enables the button
		console.log(position);
		socket.emit('createLocationMessage', { // client ==> server
			latitude: position.coords.latitude, // Nvigate the DOM
			longitude: position.coords.longitude
		});
	}, function() {
		locationButton.removeAttr('disabled').text('Send location'); // Re-enables the button
		alert('Unable to fetch location.');
	});
});

// UTILITIES
//*****************//Scrolling function for Scrolling messages when you
//at the bottom of the buffer:
function scrollToBottom() {
	// Selectors
	var messages = jQuery('#messagelist');
	var newMessage = messages.children('dd:last-child');
	// Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();
	//console.log('Scrollheight:', scrollHeight);
	//console.log(' CH:', clientHeight, 'ST:', scrollTop, 'NMH:', newMessageHeight, 'LMH:', lastMessageHeight);
	var total = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;
	//console.log('Total ', total);
	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {

		console.log('should scroll');
		messages.scrollTop(scrollHeight);
	}
}

//NOTES:
// console.log('Location:', message);
// var dd = jQuery('<dd></dd>'); // set up an unordered list tag
// //Set up the Anchor
// var a = jQuery('<a target="_blank">Click here for my current location</a>');
// //The reason we are setting the stuff below instead of just adding it through a mask
// // is to prevent malicious injection into the URL by the user.
// dd.text(`${message.from} ${message.createdAt}: `); //construct the DOM
// a.attr('href', message.url); // Construct the DOM
// dd.append(a);
// console.log('Compsed DOM:', dd);
// jQuery('#messagelist').append(dd);
