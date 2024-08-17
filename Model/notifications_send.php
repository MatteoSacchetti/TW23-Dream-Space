<?php

session_start();

if (isset($_SESSION["email"]) && isset($_POST["receiver"]) && isset($_POST["message"])) {
    $sender = $_SESSION["email"];
    $receiver = $_POST["receiver"];
    $message = $_POST["message"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per inviare una notifica
    $query = "
        INSERT INTO notifications (sender, receiver, message)
        VALUES (?, ?, ?)
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("sss", $sender, $receiver, $message);
    $stmt->execute();
    $stmt->close();
    
    echo json_encode("OK");
}
