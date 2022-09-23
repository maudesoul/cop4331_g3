<?php

	$inData = getRequestInfo();

	$contactID = $inData['contact_id'];
	$userId = $inData['userID'];
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
		$stmt = $conn->prepare("UPDATE Contacts SET firstname = ?, lastname = ?, phonenumber = ?, email = ? WHERE id_FK = ? and contact_id = ?");
		$stmt->bind_param("ssssis", $firstName, $lastName, $phonenumber, $email, $userId, $contactID);
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
