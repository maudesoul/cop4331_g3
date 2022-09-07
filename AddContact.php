<?php

	$inData = getRequestInfo();

	$username = $inData['username'];
	$firstName = $inData['firstname'];
	$lastName = $inData['lastname'];
	$phonenumber = $inData['phonenumber'];
	$email = $inData['email'];

	$conn = new mysqli("localhost", "digital", "hootDB", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if ( $conn->query("INSERT INTO Contacts($username, $firstName, $lastName, $phonenumber, $email)") )
			echo "Contact added successfully.";
		else
			returnWithError("Contact cannot be added because a contact with this phone number already exists.");

		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>