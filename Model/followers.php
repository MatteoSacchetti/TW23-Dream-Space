<?php

session_start();

if (isset($_GET["email"])) {
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per scaricare i followers di quella persona
    $query = "
        SELECT 
            profilo.nome,
            profilo.cognome,
            followers.author
        FROM followers
        JOIN profilo ON followers.author = profilo.email
        WHERE followers.follower = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
    $stmt->execute();
    $stmt->bind_result($name, $surname, $author);
    $followers = [];
    while ($stmt->fetch()) {
        $followers[] = [
            "author" => $author,
            "name" => $name,
            "surname" => $surname
        ];
    }
    $stmt->close();

    echo json_encode($followers);
}
