-- ============================================================
-- Schéma de base de données — Bibliothèque de quartier
-- Akieni Academy — Cohorte 2 — Projet S14-S15
-- ============================================================

DROP TABLE IF EXISTS emprunt CASCADE;
DROP TABLE IF EXISTS livre CASCADE;
DROP TABLE IF EXISTS adherent CASCADE;
DROP TABLE IF EXISTS auteur CASCADE;

-- ------------------------------------------------------------
-- AUTEUR
-- ------------------------------------------------------------
CREATE TABLE auteur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    nationalite VARCHAR(100)
);

-- ------------------------------------------------------------
-- ADHERENT
-- ------------------------------------------------------------
CREATE TABLE adherent (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    contact VARCHAR(150) NOT NULL
);

-- ------------------------------------------------------------
-- LIVRE
-- ------------------------------------------------------------
CREATE TABLE livre (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    annee_publication INTEGER,
    auteur_id INTEGER NOT NULL REFERENCES auteur(id) ON DELETE RESTRICT,
    disponible BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_livre_auteur ON livre(auteur_id);
CREATE INDEX idx_livre_titre ON livre(titre);

-- ------------------------------------------------------------
-- EMPRUNT
-- ------------------------------------------------------------
CREATE TABLE emprunt (
    id SERIAL PRIMARY KEY,
    adherent_id INTEGER NOT NULL REFERENCES adherent(id) ON DELETE RESTRICT,
    livre_id INTEGER NOT NULL REFERENCES livre(id) ON DELETE RESTRICT,
    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE
);

CREATE INDEX idx_emprunt_adherent ON emprunt(adherent_id);
CREATE INDEX idx_emprunt_livre ON emprunt(livre_id);
CREATE INDEX idx_emprunt_en_cours ON emprunt(date_retour_effective);

-- ------------------------------------------------------------
-- Données de test (facultatif, pratique pour tes démos Postman)
-- ------------------------------------------------------------
INSERT INTO auteur (nom, nationalite) VALUES
    ('Alain Mabanckou', 'Congolaise'),
    ('Amin Maalouf', 'Libanaise'),
    ('Léonora Miano', 'Camerounaise');

INSERT INTO adherent (nom, contact) VALUES
    ('Chris Nzila', 'chris.nzila@example.com'),
    ('Grace Mouko', '06 123 45 67');

INSERT INTO livre (titre, annee_publication, auteur_id, disponible) VALUES
    ('Verre Cassé', 2005, 1, true),
    ('Léon et Léon', 2019, 1, true),
    ('Les Identités meurtrières', 1998, 2, true);
