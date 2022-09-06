<?php

	$inData = getRequestInfo();

	$username = $inData['username'];
	$phonenumber = $inData['phonenumber'];

	$conn = new mysqli("localhost", "digital", "hootDB", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if ( $conn->query("DELETE FROM Contacts WHERE username = " . $username . " and phonenumber = " . $phonenumber) )
			echo "Contact deleted successfully.";
		else
			returnWithError("Contact cannot be deleted because it does not exist.");

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
