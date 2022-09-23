<?php

	$inData = getRequestInfo();

	$userId = $inData['userID'];
	$firstname = $inData['firstname'];
	$phonenumber = $inData['phonenumber'];

	$conn = new mysqli("localhost", "digital", "hootDB", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE id_FK = ? AND firstname = ? AND phonenumber = ?");
		$stmt->bind_param("iss", $userId, $firstname, $phonenumber);
		$stmt->execute();
		$stmt->store_result();
		if ($stmt->affected_rows > 0)
			echo "Success!";
		else
			returnWithError("Contact cannot be deleted because it does not exist.");
		$stmt->close();
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
