<?php

session_start();

if (isset($_SESSION["email"]) && isset($_GET["email"])) {
    $session_email = $_SESSION["email"];
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per inserire un nuovo follower
    $query = "
        INSERT INTO followers (author, follower)
        VALUES (?, ?)
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $session_email, $get_email);
    $stmt->execute();
    $stmt->close();
}
