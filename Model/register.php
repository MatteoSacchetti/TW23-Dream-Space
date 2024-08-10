<?php

session_start();

$name = $_POST["name"];
$surname = $_POST["surname"];
$email = $_POST["email"];
$password = $_POST["password"];

if (isset($email) && isset($password) && isset($name) && isset($surname)) {
    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per inserire i dati nel database
    $query = "insert into profilo (email, password, nome, cognome) values (?, ?, ?, ?)";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ssss", $email, $password, $name, $surname);
    $stmt->execute();
    if ($stmt->affected_rows > 0) {
        $_SESSION["email"] = $email;
        header('location: ../view/home.html');
    } else {
        header('location: ../view/register.html');
    }
    $stmt->close();
}
