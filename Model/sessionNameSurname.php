<?php

session_start();

if (isset($_SESSION["email"])) {
    $email = $_SESSION["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per ottenere nome e cognome dell'utente
    $query = "
        SELECT nome, cognome
        FROM profilo
        WHERE email = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    echo json_encode($result->fetch_assoc());
}
