<?php
require_once( $_ENV['TOP_ROOT'] . '/global/php/tools/cryptkeeper.class.php' );
require_once('config.php');

$answerId    = NULL;
$ck          = NULL;
$dbh         = NULL;
$rowCount    = NULL;
$sql         = NULL;
$sth         = NULL;

$pollResults = array( "poll" => $poll );

$answerId     = ( isset( $_POST['answerId'] ) && $_POST['answerId'] != '' ) ? (int) $_POST['answerId'] : 0;

try {
	$ck = new CryptKeeper( array('file_name' => $dbConnFile, 'vkey' => $dbConnValetKey) );
	$dbh = $ck->getDbHandle();
}catch( PDOException $e ) {
	die();
}

if($answerId != 0) {

	$sql  = "UPDATE " . $tableResponse;
	$sql .= " SET total = total + 1, modified = NOW()";
	$sql .= " WHERE answer_id = ? AND poll = ?";
	$sth = $dbh->prepare( $sql );

	$sth->execute( array( $answerId, $poll ) );

	$rowCount = $sth->rowCount();
	$sth = NULL;
	if( $rowCount < 1 ) {
		$pollResults['error'] = 'Undefined event.';
		echo json_encode( $pollResults );
		exit;
	}
}

// get the poll results
$sql  = "SELECT SUM(total) AS totalVotes FROM " . $tableResponse;
$sql .= " WHERE poll = ?";
$sth = $dbh->prepare( $sql );
$sth->execute( array( $poll ) );

$result = $sth->fetch( PDO::FETCH_ASSOC );
$totalVotes = $result['totalVotes'];

$sql = NULL;
$sth = NULL;
$restult = NULL;

$sql  = "SELECT id, poll, answer_id AS answerId, answer, total, created, modified";
$sql .= " FROM " . $tableResponse;
$sql .= " WHERE poll = ?";
$sth = $dbh->prepare( $sql );
$sth->execute( array( $poll ) );

$pollResultReturn = $sth->fetchAll( PDO::FETCH_OBJ );

if ( isset( $pollResultReturn ) && is_array( $pollResultReturn ) ){
	foreach ( $pollResultReturn as $response ) {
		if ( isset( $response->answerId ) && isset( $response->total ) && $response->total > 0 ) {
			$pollResults['answers'][ $response->answerId ] = array(
				'answer' => $response->answer
				, 'percent' => $answerPercent[ $response->answerId ] = round( ( $response->total / $totalVotes ) * 100 )
			);
		} elseif ( isset( $response->answerId ) && isset( $response->answerId ) ) {
			$pollResults['answers'][ $response->answerId ] = array(
				'answer' => $response->answer
				, 'percent' => $answerPercent[ $response->answerId ] = 0
			);
		}
	}
}
$pollResult = NULL;
$response = NULL;
$dbh = NULL;
$ck = NULL;

echo json_encode( $pollResults );

?>