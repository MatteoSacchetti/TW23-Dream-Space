<?php

session_start();

if (isset($_GET["email"])) {
    $get_email = $_GET["email"];

    // Richiamo la classe Database
    require_once "../Database/database.php";
    $db = new database();

    // TODO Query per scaricare i followers di quella persona

}
