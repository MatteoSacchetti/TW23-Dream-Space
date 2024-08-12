<?php

session_start();

if (isset($_SESSION["email"]) && isset($_GET["email"])) {
    $session_email = $_SESSION["email"];
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per eliminare un follower
    $query = "
        DELETE FROM followers
        WHERE author = ? AND follower = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $session_email, $get_email);
    $stmt->execute();
    $stmt->close();
}
