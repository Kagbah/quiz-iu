-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 18, 2024 at 03:58 PM
-- Server version: 8.0.39
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdBy`, `createdAt`) VALUES
(1, 'Kategorie 1', 'Hauke-michelsen@online.en', '2024-08-18 11:39:29'),
(2, 'dasdasd', 'Hauke-michelsen@online.en', '2024-08-18 12:08:39'),
(3, 'ASDa', 'Hauke-michelsen@online.en', '2024-08-18 12:17:57'),
(4, 'Kate23', 'Hauke-michelsen@online.en', '2024-08-18 13:40:15'),
(5, 'Kate24144', 'Hauke-michelsen@online.en', '2024-08-18 14:39:18'),
(6, 'KKKAA', 'Hauke-michelsen@online.en', '2024-08-18 15:54:43');

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int NOT NULL,
  `questionText` text NOT NULL,
  `options` json NOT NULL,
  `correctAnswer` varchar(255) NOT NULL,
  `categoryId` int DEFAULT NULL,
  `createdBy` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `questionText`, `options`, `correctAnswer`, `categoryId`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
(28, 'Welches Element hat das chemische Symbol H?', '[\"Helium\", \"Wasserstoff\", \"Holmium\", \"Hafnium\"]', 'Wasserstoff', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(29, 'Wer schrieb Hamlet?', '[\"Goethe\", \"Schiller\", \"Shakespeare\", \"Brecht\"]', 'Shakespeare', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(30, 'Was ist die Quadratwurzel von 64?', '[\"6\", \"7\", \"8\", \"9\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(31, 'Welche Sprache wird in Brasilien gesprochen?', '[\"Spanisch\", \"Französisch\", \"Portugiesisch\", \"Italienisch\"]', 'Portugiesisch', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(32, 'Wie viele Planeten hat unser Sonnensystem?', '[\"7\", \"8\", \"9\", \"10\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(33, 'Was ist das größte Säugetier?', '[\"Elefant\", \"Blauwal\", \"Giraffe\", \"Nashorn\"]', 'Blauwal', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(34, 'Welcher Planet ist der nächste zur Sonne?', '[\"Erde\", \"Mars\", \"Venus\", \"Merkur\"]', 'Merkur', 1, 'Hauke-michelsen@online.en', '2024-08-18 12:51:05', 'Hauke-michelsen@online.en', '2024-08-18 12:51:05'),
(35, 'Was ist die Hauptstadt von Frankreich?', '[\"Berlin\", \"Madrid\", \"Paris\", \"Lissabon\"]', 'Paris', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(36, 'Welche Farbe hat der Himmel?', '[\"Blau\", \"Grün\", \"Rosa\", \"Gelb\"]', 'Blau', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(37, 'Wie viele Kontinente gibt es?', '[\"5\", \"6\", \"7\", \"8\"]', '7', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(38, 'Welches Element hat das chemische Symbol H?', '[\"Helium\", \"Wasserstoff\", \"Holmium\", \"Hafnium\"]', 'Wasserstoff', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(40, 'Was ist die Quadratwurzel von 64?', '[\"6\", \"7\", \"8\", \"9\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(41, 'Welche Sprache wird in Brasilien gesprochen?', '[\"Spanisch\", \"Französisch\", \"Portugiesisch\", \"Italienisch\"]', 'Portugiesisch', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(42, 'Wie viele Planeten hat unser Sonnensystem?', '[\"7\", \"8\", \"9\", \"10\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(43, 'Was ist das größte Säugetier?', '[\"Elefant\", \"Blauwal\", \"Giraffe\", \"Nashorn\"]', 'Blauwal', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(44, 'Welcher Planet ist der nächste zur Sonne?', '[\"Erde\", \"Mars\", \"Venus\", \"Merkur\"]', 'Merkur', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:25:40', 'Hauke-michelsen@online.en', '2024-08-18 13:25:40'),
(45, 'Was ist die Hauptstadt von Frankreich?', '[\"Berlin\", \"Madrid\", \"Paris\", \"Lissabon\"]', 'Paris', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(46, 'Welche Farbe hat der Himmel?', '[\"Blau\", \"Grün\", \"Rosa\", \"Gelb\"]', 'Blau', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(47, 'Wie viele Kontinente gibt es?', '[\"5\", \"6\", \"7\", \"8\"]', '7', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(48, 'Welches Element hat das chemische Symbol H?', '[\"Helium\", \"Wasserstoff\", \"Holmium\", \"Hafnium\"]', 'Wasserstoff', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(49, 'Wer schrieb Hamlet?', '[\"Goethe\", \"Schiller\", \"Shakespeare\", \"Brecht\"]', 'Shakespeare', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(50, 'Was ist die Quadratwurzel von 64?', '[\"6\", \"7\", \"8\", \"9\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(51, 'Welche Sprache wird in Brasilien gesprochen?', '[\"Spanisch\", \"Französisch\", \"Portugiesisch\", \"Italienisch\"]', 'Portugiesisch', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(52, 'Wie viele Planeten hat unser Sonnensystem?', '[\"7\", \"8\", \"9\", \"10\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(53, 'Was ist das größte Säugetier?', '[\"Elefant\", \"Blauwal\", \"Giraffe\", \"Nashorn\"]', 'Blauwal', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(54, 'Welcher Planet ist der nächste zur Sonne?', '[\"Erde\", \"Mars\", \"Venus\", \"Merkur\"]', 'Merkur', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:30:02', 'Hauke-michelsen@online.en', '2024-08-18 13:30:02'),
(55, 'Was ist die Hauptstadt von Frankreich?', '[\"Berlin\", \"Madrid\", \"Paris\", \"Lissabon\"]', 'Paris', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(56, 'Welche Farbe hat der Himmel?', '[\"Blau\", \"Grün\", \"Rosa\", \"Gelb\"]', 'Blau', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(57, 'Wie viele Kontinente gibt es?', '[\"5\", \"6\", \"7\", \"8\"]', '7', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(58, 'Welches Element hat das chemische Symbol H?', '[\"Helium\", \"Wasserstoff\", \"Holmium\", \"Hafnium\"]', 'Wasserstoff', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(59, 'Wer schrieb Hamlet?', '[\"Goethe\", \"Schiller\", \"Shakespeare\", \"Brecht\"]', 'Shakespeare', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(60, 'Was ist die Quadratwurzel von 64?', '[\"6\", \"7\", \"8\", \"9\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(61, 'Welche Sprache wird in Brasilien gesprochen?', '[\"Spanisch\", \"Französisch\", \"Portugiesisch\", \"Italienisch\"]', 'Portugiesisch', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(62, 'Wie viele Planeten hat unser Sonnensystem?', '[\"7\", \"8\", \"9\", \"10\"]', '8', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(63, 'Was ist das größte Säugetier?', '[\"Elefant\", \"Blauwal\", \"Giraffe\", \"Nashorn\"]', 'Blauwal', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(64, 'Welcher Planet ist der nächste zur Sonne?', '[\"Erde\", \"Mars\", \"Venus\", \"Merkur\"]', 'Merkur', 1, 'Hauke-michelsen@online.en', '2024-08-18 13:42:09', 'Hauke-michelsen@online.en', '2024-08-18 13:42:09'),
(65, 'Was ist die Hauptstadt von Frankreich?', '[\"Berlin\", \"Madrid\", \"Paris\", \"Lissabon\"]', 'Paris', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(66, 'Welche Farbe hat der Himmel?', '[\"Blau\", \"Grün\", \"Rosa\", \"Gelb\"]', 'Blau', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(67, 'Wie viele Kontinente gibt es?', '[\"5\", \"6\", \"7\", \"8\"]', '7', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(68, 'Welches Element hat das chemische Symbol H?', '[\"Helium\", \"Wasserstoff\", \"Holmium\", \"Hafnium\"]', 'Wasserstoff', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(69, 'Wer schrieb Hamlet?', '[\"Goethe\", \"Schiller\", \"Shakespeare\", \"Brecht\"]', 'Shakespeare', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(70, 'Was ist die Quadratwurzel von 64?', '[\"6\", \"7\", \"8\", \"9\"]', '8', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(71, 'Welche Sprache wird in Brasilien gesprochen?', '[\"Spanisch\", \"Französisch\", \"Portugiesisch\", \"Italienisch\"]', 'Portugiesisch', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(72, 'Wie viele Planeten hat unser Sonnensystem?', '[\"7\", \"8\", \"9\", \"10\"]', '8', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(73, 'Was ist das größte Säugetier?', '[\"Elefant\", \"Blauwal\", \"Giraffe\", \"Nashorn\"]', 'Blauwal', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55'),
(74, 'Welcher Planet ist der nächste zur Sonne?', '[\"Erde\", \"Mars\", \"Venus\", \"Merkur\"]', 'Merkur', 6, 'Hauke-michelsen@online.en', '2024-08-18 15:54:55', 'Hauke-michelsen@online.en', '2024-08-18 15:54:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`) VALUES
(1, 'Hauke-michelsen@online.en', 'Passwort', 'Admin User', 'admin'),
(2, 'Hauke-michelsen@online.it', 'Passwort', 'Normal User', 'user'),
(3, 'Hauke-michelsen@online.pat', 'Passwort', 'Normal User', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
