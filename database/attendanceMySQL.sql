CREATE DATABASE IF NOT EXISTS attendanceMySQL;
USE attendanceMySQL;

CREATE TABLE employees(
	id VARCHAR(25) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(225) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

INSERT INTO employees(id, name, email) VALUES 
("EMP-120", "Stacey-Lee Pietersen", "staceypietersen2@gmail.com"),
("EMP-121", "Joy Smith", "waxieburg@gmail.com"),
("EMP-122", "Joy Lee", "spietersen2017@mysbf.co.za"),
("EMP-123", "Imaad Odendaal", "imaad@gmail.com"),
("EMP-124", "Nuha Grimwood", "nuha@gmail.com"),
("EMP-125", "Bilqees Ajam", "bilqees@gmail.com"),
("EMP-126", "Okuhle Soytanya", "okuhle@gmail.com"),
("EMP-127", "Emmanuel Tembo", "emmanuel@gmail.com"),
("EMP-128", "Khanya Freddie", "khanya@gmail.com"),
("EMP-129", "Neleh Heunis", "neleh@gmail.com");