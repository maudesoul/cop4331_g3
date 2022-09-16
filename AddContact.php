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
		$stmt = $conn->prepare("INSERT INTO Contacts (username, firstname, lastname, phonenumber, email) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $username, $firstName, $lastName, $phonenumber, $email);
		try {
			$stmt->execute();
			$stmt->store_result();
			echo "Contact added successfully..";
			$stmt->close();
			$conn->close();
		}
		catch (Exception $e)
		{
			returnWithError("Contact cannot be added because a contact with this phone number already exists.");
		}
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
