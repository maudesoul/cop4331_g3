const urlBase = 'http://home.maudesoul.com/LAMPAPI/';
const extension = 'php';

var userId = 0;
var curUsername = "";
const table = document.querySelector("#contTable");

function doLogin()
{
	console.log("Currently userID is" + userId);
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;

	if (login == "" || password == "")
	{
		document.getElementById("loginResult").innerHTML = "All fields are required.";
		return;
	}
	
	document.getElementById("loginResult").innerHTML = "";

	var tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + 'Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				saveCookie();
				
				console.log("Currently userID is" + userId);
				// getContacts();
				window.location.href = "menu.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doRegister() 
{
	console.log("Currently userID is" + userId);
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	let passwordConf = document.getElementById("extra-password").value;
	
	if (login == "" || password == "" || passwordConf == "")
	{
		document.getElementById("registerResult").innerHTML = "All fields are required.";
		return;
	}

	if (password != passwordConf)
	{
		document.getElementById("registerResult").innerHTML = "Passwords do not match."
		return;
	}

	let tmp = {username:login,password:password};
	let jsonPayload = JSON.stringify(tmp);

	var url = urlBase + 'Register.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
				window.location.href = "index.html";
				// userId = jsonObject.id; // could possibly use later
				// document.getElementById("registerResult").innerHTML = "User has been added.";
			}
		};
		xhr.send(jsonPayload);
		// window.location.href = "index.html"; // put on line 95
	}

	catch(err) 
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	username = "";
	window.location.href = "index.html";
}

function getContacts() //empty
{
	let url = urlBase + 'GetAllContacts.' + extension;

	let tmp = {userID:userId};
	console.log("Currently userID is" + userId);
	let jsonPayload = JSON.stringify(tmp);

	var table = document.getElementById("contTable");
	var t_body = document.getElementById("tableBody");

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
	 	xhr.onreadystatechange = function() 
	 	{
	 		if (this.readyState == 4 && this.status == 200) 
	 		{
				let jsonObject = JSON.parse(xhr.responseText);
				// userId = jsonObject.id;
				console.log("Currently userID is" + userId);
				console.log(jsonObject); 
		
				var row = table.insertRow(-1);

				for (var i = 0; i < jsonObject.results.length; i++)
				{
					var contact = jsonObject.results[i];
					console.log(contact.firstname);
					
					let first = document.getElementById("first");
					
					// let first = row.insertCell(1);
					// first.innerHTML = contact.firstname;
					
					let last = row.insertCell(2);
                    last.innerHTML = contact.lastname;

					let eMail = row.insertCell(3);
                    eMail.innerHTML = contact.email;

                    let phone = row.insertCell(4);
                    phone.innerHTML = contact.phonenumber;

                    let actions = row.insertCell(5);
                    actions.innerHTML = '<button onclick="deleteContact()"><img id="table-button" src="images/delete.png" alt="trash"></button><button onclick="editContact()"><img id="table-button" src="images/pencil.png" alt="pencil"></button></tr>';

					contacts.push(contact);

				}
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err) {
		document.getElementById("tableBody").innerHTML = err.message;
	}
}

function doSearch()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,id_FK:userId}; // might need to fix var names
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + 'Search.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);
				
				for (var i = 0; i < jsonObject.counters.length; i++)
				{	
					var firstname = jsonObject.counters[i].firstname;
					var lastname = jsonObject.counters[i].lastname;
					var email = jsonObject.counters[i].email;
					var phonenumber = jsonObject.counters[i].phonenumber;
          
					contactList += "Name: " + lastname + ", " + firstname + "<br>" + "Email: " + email + "<br>" + "Phone: " + phonenumber + "<br>";			
					
					if (i < jsonObject.results.length - 1)
					{
						contactList += "<br />\r\n";
					}
				}			
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function addContact()
{
	console.log("Starting to add contact...");
	console.log("Currently userID is" + userId);
	var newFirstName = document.getElementById("first-name-box").value;
	var newLastName = document.getElementById("last-name-box").value;
	var newPhoneNumber = document.getElementById("number-box").value;
	var newEmail = document.getElementById("email-box").value;	

	if (newFirstName == "" || newLastName == "" || newEmail == "" || newPhoneNumber == "")
	{
		document.getElementById("contactAddResult").innerHTML = "All fields are required.";
		return;
	}
	
	// document.getElementById("contactAddResult").innerHTML = "";
	
	let tmp = {
		firstname:newFirstName,
		lastname:newLastName,
		phonenumber:newPhoneNumber,
		email:newEmail,
		id_FK:userId
	};
	let jsonPayload = JSON.stringify(tmp);
	var url = urlBase + 'AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	// getContacts();
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				// let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("contactAddResult").innerHTML = "Contact added!";
			}
			// saveCookie();
		};
		xhr.send(jsonPayload);
		window.location.href = "menu.html";
	}

	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	// document.getElementById("contactAddResult").innerHTML = "Contact has been added";
}

function deleteContact()
{
	//var delUser = document.getElementById("username-box").value;
	var delFirstName = document.getElementById("firstnameinp").value;
	var delPhoneNumber = document.getElementById("phoneinp").value;
	
	if (confirm("This contact will be permanently deleted.") == false || curUsername == "") {
		return;
	}
	
	var jsonPayload = '{"username" : "' + curUsername + '", "firstname" : "' + delFirstName + '", "phonenumber" : "' + delPhoneNumber + '"}';
	var url = urlBase + 'Delete.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
		window.location.href = "menu.html";
	}

	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function editContact() {
	let orginalFirstName = document.getElementById('firstname');
	let orginalLastName = document.getElementById('lastname');
	let orginalPhoneNumber = document.getElementById('phonenumber');
	let orginalEmail= document.getElementById('email');

	document.getElementById("first-name-row").style = 'contenteditable="true"';
	document.getElementById("last-name-row").style = 'contenteditable="true"';
	document.getElementById("phone-number-row").style = 'contenteditable="true"';
	document.getElementById("email-row").style = 'contenteditable="true"';
	document.getElementById("actions-row") = '<button id="cancel-edit" onclick="cancelContactEdit(originalFirstName, originalLastName, originalPhoneNumber, originalEmail);">Cancel</button><button id="save-edit" onclick=saveEdit();">Save</button>';
}

function saveEdit() {
	var newFirstName = document.getElementById("first-name-box").value;
	var newLastName = document.getElementById("last-name-box").value;
	var newEmail = document.getElementById("email-box").value;
	var newPhoneNumber = document.getElementById("number-box").value;
	
	if (newFirstName == "" || newLastName == "" || newEmail == "" || newPhoneNumber == "")
	{
		document.getElementById("contactEditResult").innerHTML = "All fields are required.";
		return;
	}
	
	else 
	{		
		document.getElementById("contactEditResult").innerHTML = "";

		var jsonPayload = '{"username" : "' + curUsername + '", "firstname" : "' + newFirstName + '", "lastname" : "' + newLastName + '", "email" : "' + newEmail + '", "phone" : "' + newPhoneNumber + '"}';
		var url = urlBase + 'updateContactAPI.' + extension;
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactEditResult").innerHTML = "Contact has been edited";
				}
			};
			xhr.send(jsonPayload);
		}

		catch(err)
		{
			document.getElementById("contactEditResult").innerHTML = err.message;
		}
	}
}

function getUsername()
{
    let url = urlBase + 'GetUsername.' + extension; 
	
	var jsonPayload = '{"userId" : ' + userId + '}';

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if(this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				var name = jsonObject.username;
				document.getElementById("hoot-label").innerHTML = "Welcome, " + name;
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err)
	{
		document.getElementById("hoot-label").innerHTML = err.message;
	}
}

function loadTableData() 
{
	let url = urlBase + 'GetAllContacts.' + extension;

	// Insert Marc's getAllContactsAPI
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try 
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
			}			
		};
		xhr.send(jsonPayload);
	}
	catch (err) 
	{
		document.getElementById("loadTableResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "id_FK=" + userId + ";expires=" + date.toGMTString(); // possibly need to add username
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");

	console.log(splits);
	console.log(userId);

	for (var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "username" )
		{
			curUsername = tokens[1];
		}
		else if(tokens[0] == "id_FK")
		{
			userId = parseInt( tokens[1].trim() );
		}
}
	if (userId < 0)
	{
		window.location.href = "index.html";
	}
}
