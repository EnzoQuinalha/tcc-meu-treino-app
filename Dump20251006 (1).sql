CREATE DATABASE  IF NOT EXISTS `meu_treino_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `meu_treino_db`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: meu_treino_db
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alembic_version`
--

DROP TABLE IF EXISTS `alembic_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alembic_version` (
  `version_num` varchar(32) NOT NULL,
  PRIMARY KEY (`version_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alembic_version`
--

LOCK TABLES `alembic_version` WRITE;
/*!40000 ALTER TABLE `alembic_version` DISABLE KEYS */;
INSERT INTO `alembic_version` VALUES ('ea0f3fdd9a18');
/*!40000 ALTER TABLE `alembic_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `gif_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
INSERT INTO `exercicios` VALUES (1,'Supino Reto','https://media1.tenor.com/m/nxJqRDCmt0MAAAAd/supino-reto.gif'),(2,'Agachamento Livre','https://media1.tenor.com/m/Re3T3B66V9UAAAAd/barbellsquats-gymexercisesmen.gif'),(3,'Puxada Frontal','https://image.tuasaude.com/media/article/uh/yp/puxada-frontal_75625.gif?width=1372&height=974'),(4,'Elevação Lateral','https://media1.tenor.com/m/cy46UbnfUrkAAAAC/eleva%C3%A7%C3%A3o-lateral-hateres.gif'),(5,'Rosca Direta','https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/dumbbell-biceps-curl.gif');
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros_treino`
--

DROP TABLE IF EXISTS `registros_treino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros_treino` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `user_id` int NOT NULL,
  `treino_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `treino_id` (`treino_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `registros_treino_ibfk_1` FOREIGN KEY (`treino_id`) REFERENCES `treinos` (`id`),
  CONSTRAINT `registros_treino_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros_treino`
--

LOCK TABLES `registros_treino` WRITE;
/*!40000 ALTER TABLE `registros_treino` DISABLE KEYS */;
/*!40000 ALTER TABLE `registros_treino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treino_exercicio`
--

DROP TABLE IF EXISTS `treino_exercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treino_exercicio` (
  `id` int NOT NULL AUTO_INCREMENT,
  `treino_id` int NOT NULL,
  `exercicio_id` int NOT NULL,
  `series` varchar(50) DEFAULT NULL,
  `repeticoes` varchar(50) DEFAULT NULL,
  `descanso_seg` int DEFAULT NULL,
  `peso` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercicio_id` (`exercicio_id`),
  KEY `treino_id` (`treino_id`),
  CONSTRAINT `treino_exercicio_ibfk_1` FOREIGN KEY (`exercicio_id`) REFERENCES `exercicios` (`id`),
  CONSTRAINT `treino_exercicio_ibfk_2` FOREIGN KEY (`treino_id`) REFERENCES `treinos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treino_exercicio`
--

LOCK TABLES `treino_exercicio` WRITE;
/*!40000 ALTER TABLE `treino_exercicio` DISABLE KEYS */;
INSERT INTO `treino_exercicio` VALUES (10,4,4,'17','17',17,'17'),(11,5,1,'10','10',60,'250');
/*!40000 ALTER TABLE `treino_exercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treinos`
--

DROP TABLE IF EXISTS `treinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treinos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `dia` varchar(50) DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `treinos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treinos`
--

LOCK TABLES `treinos` WRITE;
/*!40000 ALTER TABLE `treinos` DISABLE KEYS */;
INSERT INTO `treinos` VALUES (4,'treino17','kiripam',4),(5,'Treino sexta','sexta peito',4);
/*!40000 ALTER TABLE `treinos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `senha_hash` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Usuário Insomnia','insomnia@email.com','$2b$12$2IUSQcT4VrJGOkY8aALuq.iyvlwI8oNHUJQvz.jz5h4e2m02EPeca'),(2,'jose','jose.jose@gmail.com','$2b$12$Emh/0.vcS4BCXovR/B.clOHqTykLdUxi1zBiNWfl8D5mCTJuZ3HWa'),(3,'bolsonaro','bolsonaro.jair@gmail.com','$2b$12$7j8KZCx.WSDWcejwukgKZO.IwdmD0Sc5fnFz2fh8V4G0Or8vfbkTC'),(4,'testeEnzo','testeenzo@gmail.com','$2b$12$Cq9Q0svLZ3hJtD2wHNQ43.WfImeZ38NqxRO0yxTaiiieBt3G./mJy'),(5,'Pedro','pedro@gmail.com','$2b$12$vkFYVyF8hqx/gwH.5rXFgeRyBfantVQywAhXeMjaaT5yvSYS96gqy');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'meu_treino_db'
--

--
-- Dumping routines for database 'meu_treino_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-06 15:54:07
