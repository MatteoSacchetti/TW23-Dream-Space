<?php

session_start();

if (isset($_SESSION["email"])) {
    $session_email = $_SESSION["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per scaricare le notifiche di un utente
    $query = "
        SELECT *
        FROM notifications
        WHERE receiver = ? AND status = FALSE
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $session_email);
    $stmt->execute();
    $stmt->bind_result($notification_id, $sender, $receiver, $description, $status);
    $notifications = [];
    while ($stmt->fetch()) {
        $notifications[] = [
            'notification_id' => $notification_id,
            'description' => $description
        ];
    }
    $stmt->close();

    echo json_encode($notifications);
}
