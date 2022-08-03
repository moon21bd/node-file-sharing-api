/*
SQLyog Community
MySQL - 5.7.33 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

create table `files` (
	`uuid` varchar (384),
	`filename` varchar (384),
	`private_key` varchar (765),
	`public_key` varchar (765),
	`status` tinyint (2),
	`created_at` timestamp ,
	`updated_at` timestamp 
); 
