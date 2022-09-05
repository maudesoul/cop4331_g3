
<?php

	$inData = getRequestInfo();

	$username = $inData['username'];
	$password = $inData['password'];

	$conn = new mysqli("localhost", "digital", "hootDB", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Users (username, password) VALUES (?, ?)");
		$stmt->bind_param("ss", $username, $password);
		$stmt->execute();
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
