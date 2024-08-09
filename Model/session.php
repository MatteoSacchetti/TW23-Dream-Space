<?php

session_start();

echo json_encode(['email' => isset($_SESSION["email"]) ? $_SESSION["email"] : null]);
