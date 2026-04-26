import json
import random

# Generate 30 HTML questions
html_qs = [
    ("Que signifie HTML ?", ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "Aucune des réponses"], 0),
    ("Quelle balise est utilisée pour créer un lien hypertexte ?", ["<a>", "<link>", "<href>", "<nav>"], 0),
    ("Quelle balise indique le plus grand titre ?", ["<h1>", "<head>", "<h6>", "<header>"], 0),
    ("Comment insérer une image ?", ["<img src='url'>", "<image href='url'>", "<picture src='url'>", "<img href='url'>"], 0),
    ("Quel attribut définit le texte alternatif d'une image ?", ["alt", "title", "src", "text"], 0),
    ("Comment faire une liste non ordonnée ?", ["<ul>", "<ol>", "<li>", "<list>"], 0),
    ("Quelle balise permet de créer un tableau ?", ["<table>", "<tab>", "<tr>", "<grid>"], 0),
    ("Quelle balise définit une ligne dans un tableau ?", ["<tr>", "<td>", "<th>", "<line>"], 0),
    ("Que représente <br> ?", ["Saut de ligne", "Gras", "Bouton", "Bordure"], 0),
    ("Quelle balise est utilisée pour le texte en gras ?", ["<strong>", "<bold>", "<bld>", "<heavy>"], 0),
    ("Comment faire un commentaire en HTML ?", ["<!-- Commentaire -->", "// Commentaire", "/* Commentaire */", "' Commentaire"], 0),
    ("Quelle balise contient les métadonnées de la page ?", ["<head>", "<meta>", "<header>", "<body>"], 0),
    ("Quel attribut lie un fichier CSS externe ?", ["href", "src", "link", "rel"], 0),
    ("Quelle est la balise racine d'un document HTML ?", ["<html>", "<root>", "<document>", "<main>"], 0),
    ("Comment ouvrir un lien dans un nouvel onglet ?", ["target='_blank'", "new='tab'", "target='new'", "open='_blank'"], 0),
    ("Que signifie le doctype ?", ["Type de document", "Document type engine", "Doc template", "Type text"], 0),
    ("Quelle balise crée un menu déroulant ?", ["<select>", "<dropdown>", "<list>", "<menu>"], 0),
    ("Quel attribut définit une classe CSS ?", ["class", "id", "style", "name"], 0),
    ("Comment créer une case à cocher ?", ["<input type='checkbox'>", "<check>", "<input type='check'>", "<box>"], 0),
    ("Quelle balise est sémantique pour le bas de page ?", ["<footer>", "<bottom>", "<end>", "<base>"], 0),
    ("Comment jouer une vidéo ?", ["<video>", "<media>", "<play>", "<movie>"], 0),
    ("Quel attribut rend un champ obligatoire ?", ["required", "must", "needed", "force"], 0),
    ("Que fait la balise <nav> ?", ["Navigation", "Nouvelle page", "Navigateur", "Nom"], 0),
    ("Quel est le type d'input pour un mot de passe ?", ["password", "secret", "hidden", "pass"], 0),
    ("Quelle balise définit le titre de l'onglet ?", ["<title>", "<head>", "<name>", "<tab>"], 0),
    ("Comment regrouper des éléments en bloc ?", ["<div>", "<span>", "<group>", "<block>"], 0),
    ("Comment regrouper du texte en ligne ?", ["<span>", "<div>", "<text>", "<line>"], 0),
    ("Que représente <iframe> ?", ["Un cadre en ligne", "Une image", "Une frame interactive", "Un formulaire"], 0),
    ("Quel est l'attribut pour le texte de substitution d'un input ?", ["placeholder", "value", "text", "hint"], 0),
    ("Comment lier un label à un input ?", ["attribut for", "attribut id", "attribut name", "attribut class"], 0),
]

# Generate 30 SQL questions
sql_qs = [
    ("Quelle commande permet d'extraire des données ?", ["SELECT", "GET", "EXTRACT", "PULL"], 0),
    ("Quel mot clé filtre les résultats ?", ["WHERE", "FILTER", "ORDER BY", "HAVING"], 0),
    ("Comment mettre à jour des données ?", ["UPDATE", "SAVE", "MODIFY", "CHANGE"], 0),
    ("Comment supprimer une table ?", ["DROP TABLE", "DELETE TABLE", "REMOVE TABLE", "TRUNCATE TABLE"], 0),
    ("Comment trier les résultats ?", ["ORDER BY", "SORT BY", "GROUP BY", "ARRANGE"], 0),
    ("Quel mot clé ajoute de nouvelles données ?", ["INSERT INTO", "ADD DATA", "CREATE", "NEW"], 0),
    ("Comment supprimer des lignes spécifiques ?", ["DELETE FROM", "DROP", "REMOVE", "CLEAR"], 0),
    ("Quelle fonction compte le nombre de lignes ?", ["COUNT()", "SUM()", "TOTAL()", "MAX()"], 0),
    ("Comment lier deux tables ?", ["JOIN", "LINK", "CONNECT", "MERGE"], 0),
    ("Quelle clause regroupe les lignes ayant les mêmes valeurs ?", ["GROUP BY", "ORDER BY", "MATCH", "COLLECT"], 0),
    ("Quel mot clé sélectionne les valeurs uniques ?", ["DISTINCT", "UNIQUE", "DIFFERENT", "ONLY"], 0),
    ("Comment trouver une valeur commençant par 'A' ?", ["LIKE 'A%'", "LIKE '%A'", "MATCH 'A*'", "START 'A'"], 0),
    ("Quelle commande crée une nouvelle base de données ?", ["CREATE DATABASE", "NEW DATABASE", "MAKE DB", "ADD DATABASE"], 0),
    ("Quel mot clé est utilisé avec GROUP BY pour filtrer ?", ["HAVING", "WHERE", "FILTER", "CONDITION"], 0),
    ("Comment renommer temporairement une colonne ?", ["AS", "RENAME", "LIKE", "TO"], 0),
    ("Quelle contrainte assure l'unicité d'une colonne ?", ["UNIQUE", "PRIMARY", "SINGLE", "ONE"], 0),
    ("Que fait TRUNCATE TABLE ?", ["Vide la table", "Supprime la table", "Copie la table", "Rien"], 0),
    ("Quel est le type de données pour du texte long ?", ["TEXT", "VARCHAR", "STRING", "CHAR"], 0),
    ("Comment additionner les valeurs d'une colonne ?", ["SUM()", "ADD()", "TOTAL()", "PLUS()"], 0),
    ("Quel opérateur signifie 'non égal' ?", ["<>", "!=", "NOT", "Les deux premiers"], 3),
    ("Comment insérer la valeur nulle ?", ["NULL", "0", "''", "BLANK"], 0),
    ("Quelle commande modifie la structure d'une table ?", ["ALTER TABLE", "UPDATE TABLE", "CHANGE TABLE", "MODIFY TABLE"], 0),
    ("Quel type de JOIN retourne toutes les lignes correspondantes ?", ["INNER JOIN", "OUTER JOIN", "ALL JOIN", "FULL JOIN"], 0),
    ("Comment trouver les valeurs entre 10 et 20 ?", ["BETWEEN 10 AND 20", "IN (10, 20)", "RANGE 10-20", "FROM 10 TO 20"], 0),
    ("Quel mot clé annule une transaction ?", ["ROLLBACK", "UNDO", "CANCEL", "REVERT"], 0),
    ("Que fait COMMIT ?", ["Sauvegarde les changements", "Ferme la base", "Crée une table", "Exécute une requête"], 0),
    ("Quelle fonction trouve la valeur maximale ?", ["MAX()", "HIGH()", "TOP()", "PEAK()"], 0),
    ("Comment sélectionner toutes les colonnes ?", ["SELECT *", "SELECT ALL", "SELECT columns", "GET *"], 0),
    ("Quel opérateur vérifie si une valeur est dans une liste ?", ["IN", "ANY", "EXISTS", "MATCH"], 0),
    ("Quelle fonction renvoie la date actuelle ?", ["NOW()", "TODAY()", "DATE()", "CURRENT()"], 0),
]

# Generate 30 JS questions
js_qs = [
    ("Comment déclarer une variable modifiable en ES6 ?", ["let", "const", "var", "def"], 0),
    ("Quel opérateur compare la valeur ET le type ?", ["===", "==", "=", "!=="], 0),
    ("Comment afficher un message dans la console ?", ["console.log()", "print()", "echo()", "log.console()"], 0),
    ("Quelle est l'extension d'un fichier JavaScript ?", [".js", ".java", ".script", ".jsx"], 0),
    ("Comment créer une fonction en JS ?", ["function myFunction()", "create myFunction()", "def myFunction()", "func myFunction()"], 0),
    ("Comment appeler une fonction nommée 'myFunction' ?", ["myFunction()", "call myFunction()", "run myFunction", "execute()"], 0),
    ("Comment écrire un commentaire sur une ligne ?", ["//", "/*", "<!--", "#"], 0),
    ("Comment trouver la longueur d'un tableau ?", ["array.length", "array.size", "array.count", "array.len"], 0),
    ("Quel événement se déclenche au clic ?", ["onclick", "onmouse", "onpress", "onchange"], 0),
    ("Comment déclarer une constante ?", ["const", "let", "var", "final"], 0),
    ("Quel mot clé renvoie une valeur dans une fonction ?", ["return", "give", "send", "output"], 0),
    ("Comment arrondir le nombre 7.25 ?", ["Math.round(7.25)", "rnd(7.25)", "Math.rnd(7.25)", "round(7.25)"], 0),
    ("Comment ajouter un élément à la fin d'un tableau ?", ["push()", "add()", "append()", "insert()"], 0),
    ("Que renvoie typeof 'Hello' ?", ["string", "text", "char", "undefined"], 0),
    ("Comment convertir une chaîne en entier ?", ["parseInt()", "toInteger()", "Number()", "Int()"], 0),
    ("Quel objet représente le document HTML en JS ?", ["document", "window", "html", "page"], 0),
    ("Comment séléctionner un élément par son ID ?", ["getElementById()", "selectId()", "queryId()", "getId()"], 0),
    ("Que fait JSON.stringify() ?", ["Objet -> Chaîne", "Chaîne -> Objet", "Copie un objet", "Supprime un objet"], 0),
    ("Que signifie NaN ?", ["Not a Number", "Null and Negative", "No assigned Number", "Nonsense"], 0),
    ("Comment vérifier si une variable est un tableau ?", ["Array.isArray()", "typeof", "is_array()", "checkArray()"], 0),
    ("Quelle méthode retire le dernier élément d'un tableau ?", ["pop()", "remove()", "shift()", "delete()"], 0),
    ("Que renvoie 3 + '3' en JS ?", ["'33'", "6", "NaN", "Erreur"], 0),
    ("Quel mot-clé attend la résolution d'une promesse ?", ["await", "async", "wait", "then"], 0),
    ("Comment déclarer une fonction fléchée ?", ["() => {}", "function() {}", "=> ()", "func() =>"], 0),
    ("Que fait setTimeout() ?", ["Délai d'exécution", "Arrête le script", "Chronomètre", "Répète l'action"], 0),
    ("Comment lier deux chaînes de caractères ?", ["concat() ou +", "join()", "link()", "bind()"], 0),
    ("Quelle méthode transforme un tableau en chaîne ?", ["join()", "toString()", "concat()", "Les deux premiers"], 3),
    ("Que fait filter() sur un tableau ?", ["Crée un nouveau tableau filtré", "Modifie le tableau original", "Supprime le tableau", "Trie le tableau"], 0),
    ("Quel est le résultat de typeof null ?", ["object", "null", "undefined", "string"], 0),
    ("Comment intercepter une erreur ?", ["try...catch", "if...else", "throw...error", "catch...try"], 0),
]

def format_quiz(title, desc, cat, score, time, q_list):
    questions = []
    for text, opts, correct_idx in q_list:
        options = []
        for i, opt in enumerate(opts):
            options.append({
                "text": opt,
                "is_correct": i == correct_idx
            })
        questions.append({
            "text": text,
            "options": options
        })
    return {
        "title": title,
        "description": desc,
        "category": cat,
        "passing_score": score,
        "time_limit": time,
        "questions": questions
    }

data = [
    format_quiz('HTML5 Fondations', 'Testez vos connaissances en HTML5.', 'HTML', 70, 15, html_qs),
    format_quiz('SQL Débutant', 'Quiz sur les requêtes SQL.', 'SQL', 75, 20, sql_qs),
    format_quiz('JavaScript Basics', 'Validez vos compétences en JS.', 'JavaScript', 60, 20, js_qs),
]

with open('quizzes_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Data written to quizzes_data.json")
