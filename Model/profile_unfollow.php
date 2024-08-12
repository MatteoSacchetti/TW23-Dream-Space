<?php

session_start();

if (isset($_GET["email"])) {
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per eliminare un follower
    $query = "
        DELETE FROM followers
        WHERE author = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
    $stmt->execute();
    $stmt->close();
}
