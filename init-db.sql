-- Script d'initialisation de la base de données
-- Ce script est exécuté automatiquement lors du premier démarrage de PostgreSQL
-- Création de la base de données (déjà créée par POSTGRES_DB)
-- CREATE DATABASE IF NOT EXISTS foodie_cook;
-- Extensions utiles pour PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";
-- Vous pouvez ajouter ici des données de test ou des configurations spécifiques
-- Par exemple, des utilisateurs de test, des catégories par défaut, etc.
-- Exemple de catégories par défaut (optionnel)
-- INSERT INTO categories (name) VALUES 
--   ('Entrées'),
--   ('Plats principaux'),
--   ('Desserts'),
--   ('Boissons'),
--   ('Végétarien'),
--   ('Vegan')
-- ON CONFLICT DO NOTHING;