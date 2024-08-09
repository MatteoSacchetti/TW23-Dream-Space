<?php

session_start();

// Richiamo la classe Database
require_once "../Database/database.php";
$db = new database();

if (isset($_POST["post_id"]) && isset($_POST["comment"]) && isset($_SESSION["email"])) {
    $query = "
        INSERT INTO post_comments (post_id, author, comment)
        VALUES (?, ?, ?)
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("iss", $_POST["post_id"], $_SESSION["email"], $_POST["comment"]);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        echo json_encode("OK");
    }
    $stmt->close();
}
