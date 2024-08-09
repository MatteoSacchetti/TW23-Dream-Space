<?php

class database
{
    public $sql;
    public function __construct()
    {
        define("HOST", "localhost");
        define("USER", "secure_user");
        define("PASSWORD", "dreamspace");
        define("DATABASE", "dreamspace");
        $this->sql = new mysqli(HOST, USER, PASSWORD, DATABASE);
    }
}