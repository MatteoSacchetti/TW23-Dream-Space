<?php

session_start();

if (isset($_SESSION["email"]) && isset($_POST["description"]) && isset($_FILES["photos"])) {
    $email = $_SESSION["email"];
    $description = $_POST["description"];
    $photos = $_FILES["photos"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per inserire i post nel database e ritorno l'id del post
    $query = "INSERT INTO post (author, description) VALUES (?, ?)";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $email, $description);
    $stmt->execute();
    $id = $stmt->insert_id;
    $stmt->close();

    // Mette le foto in una cartella del server
    $photos_url = [];
    if (is_array($photos["name"])) {
        // Per ogni foto caricata la salvo in una cartella del server e memorizzo il percorso
        foreach ($photos["name"] as $key => $photo) {
            $photo_url = "Image/" . $id . "-" . $key + 1 . ".jpg";
            move_uploaded_file($photos["tmp_name"][$key], "../" . $photo_url);
            $photos_url[] = "../" . $photo_url;
        }
    }

    // Query per inserire le foto del post nel database
    foreach ($photos_url as $photo_url) {
        $query = "INSERT INTO post_photos (post_id, photo_url) VALUES (?, ?)";
        $stmt = $db->sql->prepare($query);
        $stmt->bind_param("is", $id, $photo_url);
        $stmt->execute();
        $stmt->close();
    }

    header('location: ../view/profile.html?email=' . $email);
}
