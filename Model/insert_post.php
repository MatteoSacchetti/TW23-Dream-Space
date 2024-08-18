<?php

session_start();

if (isset($_SESSION["email"]) && isset($_POST["description"]) && isset($_FILES["photos"])) {
    $email = $_SESSION["email"];
    $description = $_POST["description"];
    $photos = $_FILES["photos"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

}
