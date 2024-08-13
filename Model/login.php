<?php

session_start();

$email = $_POST["email"];
$password = $_POST["password"];

if (isset($email) && isset($password)) {
    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per verificare i dati nel database
    $query = "select * from profilo where email = ? and password = ?";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        $_SESSION["email"] = $email;
        header('location: ../view/home.html');
    } else {
        header('location: ../view/index.html');
    }
    $stmt->close();
}