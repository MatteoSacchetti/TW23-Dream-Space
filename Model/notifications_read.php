<?php

session_start();

if (isset($_POST['notification_id'])) {
    $post_notification_id = $_POST['notification_id'];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per aggiornare le notifiche di un utente
    $query = "
        UPDATE notifications
        SET status = TRUE
        WHERE notification_id = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("i", $post_notification_id);
    $stmt->execute();
    $stmt->close();

    echo json_encode("OK");
}
