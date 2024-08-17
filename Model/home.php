<?php

session_start();

// Richiamo la classe Database
require_once "../Database/database.php";
$db = new database();

// Creo un array vuoto per memorizzare tutti i post
$posts = [];

// Scarico tutti i post
$query = "
    SELECT 
        post.post_id,
        post.description,
        profilo.email,
        profilo.nome,
        profilo.cognome
    FROM post
    JOIN profilo ON post.author = profilo.email
";
$stmt = $db->sql->prepare($query);
$stmt->execute();
$stmt->bind_result($post_id, $description, $email, $name, $surname);
while ($stmt->fetch()) {
    $posts[] = [
        'post_id' => $post_id,
        'description' => $description,
        'email' => $email,
        'name' => $name,
        'surname' => $surname,
        'photo_urls' => [],
        'comments' => []
    ];
}
$stmt->close();

// Scarico tutte le foto
$query = "
    SELECT 
        post.post_id,
        post_photos.photo_url
    FROM post
    JOIN post_photos ON post.post_id = post_photos.post_id
    ORDER BY post_photos.photo_url ASC
";
$stmt = $db->sql->prepare($query);
$stmt->execute();
$stmt->bind_result($post_id, $photos_url);
while ($stmt->fetch()) {
    foreach ($posts as &$post) {
        if ($post['post_id'] == $post_id) {
            $post['photo_urls'][] = $photos_url;
            break;
        }
    }
}
$stmt->close();

// Scarico tutti i commenti
$query = "
    SELECT 
        post.post_id,
        post_comments.author,
        profilo.nome,
        profilo.cognome,
        post_comments.comment
    FROM post
    JOIN post_comments ON post.post_id = post_comments.post_id
    JOIN profilo ON post_comments.author = profilo.email
    ORDER BY post_comments.datetime ASC
";
$stmt = $db->sql->prepare($query);
$stmt->execute();
$stmt->bind_result($post_id, $author, $author_name, $author_surname, $comment);
while ($stmt->fetch()) {
    foreach ($posts as &$post) {
        if ($post['post_id'] == $post_id) {
            $post['comments'][] = [
                'author' => $author,
                'author_name' => $author_name,
                'author_surname' => $author_surname,
                'comment' => $comment
            ];
            break;
        }
    }
}
$stmt->close();

echo json_encode($posts);
