<?php

session_start();

// Pulisco i dati della sessione e torno alla pagina di login
session_unset();
header('location: ../view/index.html');
