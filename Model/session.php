<?php

session_start();

// Stampa l'email dell'utente loggato
echo json_encode(['email' => isset($_SESSION["email"]) ? $_SESSION["email"] : null]);
