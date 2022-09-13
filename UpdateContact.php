<?php

	$inData = getRequestInfo();

	$username = $inData['username'];
	$firstName = $inData['firstname'];
	$lastName = $inData['lastname'];
	$phonenumber = $inData['phonenumber'];
	$email = $inData['email'];

	$conn = new mysqli("localhost", "admin", "my_password", "testdb"); 		
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET firstname = ?, lastname = ?, phonenumber = ?, email = ? WHERE username = ?");
		$stmt->bind_param("sssss", $firstName, $lastName, $phonenumber, $email, $username);
		try {
			$stmt->execute();
			$stmt->store_result();
			echo "Contact Updated.";
			$stmt->close();
			$conn->close();
		}
		catch (Exception $e)
		{
			returnWithError("Error.");
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