<?php

$email = $_POST["email"];
$password = $_POST["password"];

if (isset($email) && isset($password)) {
    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per inserire i dati nel database
    $query = "insert into profilo (email, password) values (?, ?)";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $email, $password);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        $_SESSION["email"] = $email;
        header('location: ../view/home.html');
    }
    $stmt->close();
}
