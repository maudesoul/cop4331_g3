<?php

	$inData = getRequestInfo();

	$username = $inData['username'];
    $contactID = $inData['contact_id'];
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
		if ( $conn->query("UPDATE Contacts SET firstname = $firstName, lastname = $lastName, phonenumber = $phonenumber, email = $email WHERE contactID = $contact_id and username = $username") )
			echo "Contact updated successfully.";
		else
			returnWithError("Contact cannot be updated because this contact does not exist");

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