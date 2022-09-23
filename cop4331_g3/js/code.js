const urlBase = 'http://home.maudesoul.com/LAMPAPI/';
const extension = 'php';

var userId = 0;
var curContactId = 0;
var curUsername = "";
var searchInput = "";
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
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err) 
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function doLogout()
{
	userId = 0;
	contactID = 0;
	username = "";
	searchInput = "";
	document.cookie = "id_FK=,username=,contact_id=,search=;expires=-1;";
	window.location.href = "index.html";
}

function doSearch()
{
	searchInput = document.getElementById("query").value;
	document.getElementById("searchResult").innerHTML = "";	
	saveCookie();
	window.location.reload();
}

function callSearch()
{
	let tmp = {search:searchInput,userID:userId}; 
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + 'Search.' + extension;

	var t_body = document.getElementById("tableBody");
	t_body.innerHTML = "";

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

				if (jsonObject == null)
					return;
				
				for (let i = 0; i < jsonObject.results.length; i++)
				{
					let rowOne = t_body.insertRow(-1);

					let cellOne = rowOne.insertCell(-1);
					cellOne.innerHTML = jsonObject.results[i]['First Name'];

					let cellTwo = rowOne.insertCell(-1);
					cellTwo.innerHTML = jsonObject.results[i]['Last Name'];

					let cellThree = rowOne.insertCell(-1);
					cellThree.innerHTML = jsonObject.results[i]['Email'];

					let cellFour = rowOne.insertCell(-1);
					cellFour.innerHTML = jsonObject.results[i]['Phone Number'];

					let cellFive = rowOne.insertCell(-1);
                    cellFive.innerHTML = '<button onclick="deleteContact(\'' + jsonObject.results[i]["First Name"] + '\',\'' + jsonObject.results[i]["Phone Number"] + '\')"><img id="table-button" src="images/delete.png" alt="trash"></button>'
										+ '<button onclick="editContact(\'' + jsonObject.results[i]['Contact ID'] +  '\',\'' + jsonObject.results[i]['First Name'] + '\',\'' + jsonObject.results[i]['Last Name'] + '\',\'' + jsonObject.results[i]['Email']
					  				    + '\',\'' + jsonObject.results[i]['Phone Number'] + '\')"><img id="table-button" src="images/pencil.png" alt="pencil"></button></tr>';
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		return;
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
	
	let tmp = {
		firstname:newFirstName,
		lastname:newLastName,
		phonenumber:newPhoneNumber,
		email:newEmail,
		userID:userId
	};
	let jsonPayload = JSON.stringify(tmp);
	var url = urlBase + 'AddContact.' + extension;
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact added!";
				window.location.href = "menu.html";
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function deleteContact(first_name, phone_number)
{
	let flag = window.confirm('Delete this contact?');
	if(!flag) {
		return; 
	}

	var jsonPayload = '{"userID" : "' + userId + '", "firstname" : "' + first_name + '", "phonenumber" : "' + phone_number + '"}';
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
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	}

	catch(err)
	{
		console.log(err);
	}
}

function editContact(contactID, first, last, email, phone) {
	curContactId = contactID;
	saveCookie();
	console.log("Current ID is : " + contactID);
	// document.getElementById("first-name-box-edit").setAttribute("value", first);
	// document.getElementById("last-name-box-edit").setAttribute("value", last);
	// document.getElementById("number-box-edit").setAttribute("value", phone);
	// document.getElementById("email-box-edit").setAttribute("value", email);
	window.location.href = "contactEdit.html";
}

function saveEdit() 
{
	var newFirstName = document.getElementById("first-name-box-edit").value;
	var newLastName = document.getElementById("last-name-box-edit").value;
	var newEmail = document.getElementById("email-box-edit").value;
	var newPhoneNumber = document.getElementById("number-box-edit").value;

	console.log("Contact ID is: " + curContactID);
	
	if (newFirstName == "" || newLastName == "" || newEmail == "" || newPhoneNumber == "")
	{
		document.getElementById("contactEditResult").innerHTML = "All fields are required.";
		return;
	}
	
	else 
	{		
		document.getElementById("contactEditResult").innerHTML = "";

		var jsonPayload = '{"userID" : ' + userId + '", "contact_id":,' + curContactId + ',"firstname" : "' + newFirstName + '", "lastname" : "' + newLastName + '", "email" : "' + newEmail + '", "phone" : "' + newPhoneNumber + '"}';
		var url = urlBase + 'UpdateContact.' + extension;
		
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

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "id_FK=" + userId + ", username=" + curUsername + ", contact_id=" + curContactId + ", search=" + searchInput + ";expires=" + date.toGMTString(); // possibly need to add username
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
		if( tokens[0] == "curUsername" )
		{
			curUsername = tokens[1];
		}
		else if(tokens[0] == "id_FK")
		{
			userId = parseInt( tokens[1].trim() );
		}
		else if(tokens[0] == "contact_id")
		{
			curContactId = parseInt( tokens[1].trim() );
		}
		else if(tokens[0] == "search")
		{
			searchInput = tokens[1];
		}
}
	if (userId < 0)
	{
		window.location.href = "index.html";
	}
}