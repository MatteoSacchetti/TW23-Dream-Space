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
            followers.follower
        FROM followers
        JOIN profilo ON followers.follower = profilo.email
        WHERE followers.author = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
    $stmt->execute();
    $stmt->bind_result($name, $surname, $follower);
    $following = [];
    while ($stmt->fetch()) {
        $following[] = [
            "follower" => $follower,
            "name" => $name,
            "surname" => $surname
        ];
    }
    $stmt->close();

    echo json_encode($following);
}
