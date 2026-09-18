-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2025 at 08:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `excel_tuition`
--

-- --------------------------------------------------------

--
-- Table structure for table `course_details`
--

CREATE TABLE `course_details` (
  `course_id` int(11) NOT NULL,
  `course_name` varchar(44) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `course_price` varchar(22) NOT NULL,
  `days` varchar(20) NOT NULL,
  `time` varchar(44) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_details`
--

INSERT INTO `course_details` (`course_id`, `course_name`, `tutor_id`, `course_price`, `days`, `time`) VALUES
(1, 'Maths', 12, '35/week', 'monday and friday', '5pm to 6pm'),
(2, 'Maths', 2, '35/week', 'monday and thursday', '5pm to 6pm'),
(3, 'English', 11, '25/week', 'monday and wednesday', '6pm to 7pm'),
(4, 'English', 5, '25/week', 'Tuesday', '6pm to 7pm'),
(5, 'English', 21, '25/week', 'friday', '5pm to 6pm'),
(6, 'English', 2, '25/week', 'friday', '6pm to 7pm');

-- --------------------------------------------------------

--
-- Table structure for table `leave_request`
--

CREATE TABLE `leave_request` (
  `user_id` int(20) NOT NULL,
  `id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending/approved',
  `comment` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_request`
--

INSERT INTO `leave_request` (`user_id`, `id`, `start_date`, `end_date`, `reason`, `status`, `comment`) VALUES
(8, 19, '2025-09-25', '2025-09-26', 'cold', 'approved', 'Get well soon'),
(10, 20, '2025-09-12', '2025-09-12', 'ss', 'approved', 'get well'),
(3, 25, '2025-09-11', '2025-09-25', 'holiday', 'pending', ''),
(8, 26, '2025-09-24', '2025-09-28', 'sick', 'approved', 'get well'),
(9, 27, '2025-09-29', '2025-09-30', 'sick', 'pending', ''),
(3, 30, '2025-09-28', '2025-09-29', 'sick', 'approved', 'get well soon'),
(3, 31, '2025-10-01', '2025-10-02', 'Dr Appointment', 'pending', ''),
(3, 32, '2025-10-13', '2025-10-14', 'sick', 'approved', 'get well'),
(3, 33, '2025-10-14', '2025-10-15', 'sick', 'approved', 'get well'),
(3, 34, '2025-10-31', '2025-11-01', 'sick', 'approved', 'get well');

-- --------------------------------------------------------

--
-- Table structure for table `our_tutors`
--

CREATE TABLE `our_tutors` (
  `id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `subject` varchar(44) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `our_tutors`
--

INSERT INTO `our_tutors` (`id`, `tutor_id`, `subject`, `email`, `phone`) VALUES
(1, 12, 'Maths', 'joseph@excel.com', '2234566'),
(3, 2, 'Maths', 'peter@excel.com', '2234533'),
(4, 11, 'English', 'ann@excel.com', '2234321'),
(5, 5, 'English', 'grace@excel.com', '2345123'),
(6, 21, 'English', 'teena@gmail.com', '2345234'),
(7, 23, 'Maths', 'Neel@excel.com', '2234322');

-- --------------------------------------------------------

--
-- Table structure for table `progress_report`
--

CREATE TABLE `progress_report` (
  `user_id` int(20) NOT NULL,
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `student_name` varchar(88) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `score` int(11) NOT NULL,
  `attendance` varchar(22) NOT NULL,
  `feedback` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `progress_report`
--

INSERT INTO `progress_report` (`user_id`, `id`, `date`, `student_name`, `subject`, `score`, `attendance`, `feedback`) VALUES
(3, 1, '2025-09-06', 'soumya', 'maths', 88, '90%', 'good'),
(10, 101, '2025-09-11', 'luke', 'maths', 88, '90', 'excellent'),
(15, 110, '2025-09-18', 'sayge', 'math', 99, '90%', 'excellent'),
(3, 112, '2025-10-03', 'soumya', 'maths', 55, '66', 'good');

-- --------------------------------------------------------

--
-- Table structure for table `student_course`
--

CREATE TABLE `student_course` (
  `user_id` int(20) NOT NULL,
  `id` int(11) NOT NULL,
  `tutor_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_course`
--

INSERT INTO `student_course` (`user_id`, `id`, `tutor_id`, `course_id`) VALUES
(8, 9, 2, 2),
(9, 10, 11, 3),
(10, 14, 5, 4),
(3, 15, 12, 1),
(3, 16, 2, 2),
(3, 17, 2, 6),
(3, 18, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `student_parent`
--

CREATE TABLE `student_parent` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `relation` varchar(20) NOT NULL DEFAULT 'mom/dad/other'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_parent`
--

INSERT INTO `student_parent` (`id`, `student_id`, `parent_id`, `relation`) VALUES
(2, 10, 13, 'mom'),
(3, 15, 13, 'mom'),
(4, 14, 16, 'Father'),
(5, 14, 13, 'mom');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(20) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(40) NOT NULL,
  `phonenumber` varchar(20) NOT NULL,
  `password` varchar(30) NOT NULL,
  `role` varchar(40) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending/approved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `phonenumber`, `password`, `role`, `status`) VALUES
(1, 'sm', 'admin@gmail.com', '0', '123', 'admin', 'approved'),
(2, 'Peter', 'peter@excel.com', '2234533', '123456', 'tutor', 'approved'),
(3, 'Soumya', 'sou@gmail.com', '224691812', '12345', 'student', 'approved'),
(5, 'Grace', 'grace@excel.com', '2345123', '444', 'tutor', 'approved'),
(6, 'Sophia', 'sophia@excel.com', '2345123', '333', 'tutor', 'approved'),
(8, 'sam', 'sam@gmail.com', '123', '123', 'student', 'approved'),
(9, 'sunny', 'sun@gmail.com', '1234', '111', 'student', 'approved'),
(10, 'luke', 'luke@gmail.com', '12321', '1234', 'student', 'approved'),
(11, 'Ann', 'ann@excel.com', '2234321', '12', 'tutor', 'pending'),
(12, 'joseph', 'joseph@excel.com', '1234', '000', 'tutor', 'approved'),
(13, 'lima', 'lima@gmail.com', '234567', '123', 'parent', 'approved'),
(14, 'seyan', 'seyan@gmail.com', '22342567', '1710', 'student', 'pending'),
(15, 'sayge', 'sayge@gmail.com', '2287878', '555', 'student', 'approved'),
(16, 'sudish', 'sud@gmail.com', '2345678', '2525', 'parent', 'approved'),
(17, 'mohan', 'mohan@gmail.com', '2345617', '999', 'parent', 'approved'),
(18, 'Rajesh', 'raja@gamil.com', '34535672', '4545', 'parent', 'pending'),
(19, 'fallyn', 'fallyn@gmail.com', '323567', '3434', 'student', 'approved'),
(20, 'sara', 'sara@gmail.com', '2345', '111', 'student', 'approved'),
(21, 'Teena', 'teena@gmail.com', '2345234', '999', 'tutor', 'approved'),
(22, 'sm', 'sss@rrr', '123', '111', 'parent', 'approved'),
(23, 'Neel', 'Neel@excel.com', '12344324', '1112', 'tutor', 'approved'),
(24, 'liam', 'liam@excel.com', '1233456', '111', 'tutor', 'approved'),
(25, 'max', 'max@excdl.com', '2345677', '111', 'tutor', 'approved'),
(26, 'ss', 'ss@ss', '23455', '1234', 'student', 'pending');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course_details`
--
ALTER TABLE `course_details`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `user_id_2` (`user_id`);

--
-- Indexes for table `our_tutors`
--
ALTER TABLE `our_tutors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `progress_report`
--
ALTER TABLE `progress_report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student_course`
--
ALTER TABLE `student_course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_course_ibfk_1` (`course_id`),
  ADD KEY `fk_student_course_user` (`user_id`);

--
-- Indexes for table `student_parent`
--
ALTER TABLE `student_parent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `course_details`
--
ALTER TABLE `course_details`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `leave_request`
--
ALTER TABLE `leave_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `our_tutors`
--
ALTER TABLE `our_tutors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `progress_report`
--
ALTER TABLE `progress_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `student_course`
--
ALTER TABLE `student_course`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `student_parent`
--
ALTER TABLE `student_parent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD CONSTRAINT `leave_request_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `progress_report`
--
ALTER TABLE `progress_report`
  ADD CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_course`
--
ALTER TABLE `student_course`
  ADD CONSTRAINT `fk_student_course_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_course_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course_details` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
