<?php

session_start();

// Richiamo la classe Database
require_once "../Database/database.php";
$db = new database();

// Query per scaricare tutti i post
$query = "
        SELECT 
            post.post_id,
            post.description,
            profilo.email,
            profilo.nome,
            profilo.cognome,
            post_photos.photo_url
        FROM post
        JOIN profilo ON post.author = profilo.email
        LEFT JOIN post_photos ON post.post_id = post_photos.post_id
    ";
$stmt = $db->sql->prepare($query);
$stmt->execute();
$stmt->bind_result($post_id, $description, $email, $name, $surname, $photos_url);
$posts = [];
$postIndex = [];

// Salvo tutte le informazioni dei posts e le stampo
while ($stmt->fetch()) {
    if (!isset($postIndex[$post_id])) {
        $postIndex[$post_id] = count($posts);
        $posts[] = [
            'post_id' => $post_id,
            'description' => $description,
            'email' => $email,
            'name' => $name,
            'surname' => $surname,
            'photo_urls' => []
        ];
    }
    if ($photos_url !== null) {
        $posts[$postIndex[$post_id]]['photo_urls'][] = $photos_url;
    }
}
$stmt->close();

echo json_encode($posts);
