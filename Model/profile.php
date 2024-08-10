<?php

session_start();

if (isset($_SESSION["email"]) && isset($_GET["email"])) {
    $session_email = $_SESSION["email"];
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // Query per scaricare i dati del profilo
    $query = "
        SELECT 
            profilo.nome,
            profilo.cognome
        FROM profilo
        WHERE profilo.email = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
    $stmt->execute();
    $stmt->bind_result($name, $surname);
    $stmt->fetch();
    $stmt->close();

    // Query per scaricare i followers e following
    $query = "
        SELECT 
            (SELECT COUNT(*) FROM followers WHERE author = ?) AS following,
            (SELECT COUNT(*) FROM followers WHERE follower = ?) AS followers
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("ss", $get_email, $get_email);
    $stmt->execute();
    $stmt->bind_result($following, $followers);
    $stmt->fetch();
    $stmt->close();

    // Query per scaricare post del profilo
    $posts = [];
    $query = "
        SELECT 
            post.post_id,
            post.description
        FROM post
        WHERE post.author = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
    $stmt->execute();
    $stmt->bind_result($post_id, $description);
    while ($stmt->fetch()) {
        $posts[] = [
            'post_id' => $post_id,
            'description' => $description,
            'photo_urls' => [],
            'comments' => []
        ];
    }
    $stmt->close();

    // Scarico tutte le foto dei post
    $query = "
        SELECT 
            post.post_id,
            post_photos.photo_url
        FROM post
        JOIN post_photos ON post.post_id = post_photos.post_id
        WHERE post.author = ?
        ORDER BY post_photos.photo_url ASC
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
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

    // Scarico tutti i commenti dei post
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
        WHERE post.author = ?
    ";
    $stmt = $db->sql->prepare($query);
    $stmt->bind_param("s", $get_email);
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

    // Creo la risposta 
    $response = [
        "name" => $name,
        "surname" => $surname,
        "followers" => $followers,
        "following" => $following,
        "posts" => $posts
    ];

    echo json_encode($response);
}
