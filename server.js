const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "fmbaye_dev",
  password: "GAYA_linux@2005",
  database: "magazin_bd",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connection a la base de données MySQL réussit");

  connection.query(
    "create database if not exists magazin_bd",
    (err, result) => {
      if (err) throw err;
      console.log("La base de données a été crée avec succés!");
    }
  );

  const requeteSql = `create table if not exists produits (
    id int auto_increment primary key,
    nom varchar(100),
    prix int,
    quantite int,
    categorie varchar(50),
    date_ajout datetime
  )`;

  connection.query(requeteSql, (err, result) => {
    if (err) throw err;
    console.log("Table créée avec succes!");
  });
});

app.get("/", (req, res) => {
  const success = req.query.success;
  const error = req.query.error;

  connection.query("select * from produits", (err, result) => {
    if (err) throw err;

    res.render("index.ejs", {
      produits: result,
      success,
      error,
    });
  });
});

app.get("/modifier/:id", (req, res) => {
  const id = req.params.id;

  connection.query(
    "select * from produits where id = ?",
    [id],
    (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.status(404).render("404.ejs", {
          message: "Produit introuvable"
        });
      }

      res.render("modifier.ejs", {
        produit: result[0],
        error: null
      });
    }
  );
});

app.post("/produits/:id/modifier", (req, res) => {
  const id = req.params.id;
  const { nom, prix, quantite, categorie } = req.body;

  if (!nom || !prix || quantite === undefined || !categorie) {
    return res.render("modifier.ejs", {
      produit: { id, nom, prix, quantite, categorie },
      error: "Tous les champs sont obligatoires"
    });
  }

  if (prix <= 0) {
    return res.render("modifier.ejs", {
      produit: { id, nom, prix, quantite, categorie },
      error: "Le prix doit être supérieur à 0"
    });
  }

  if (quantite < 0) {
    return res.render("modifier.ejs", {
      produit: { id, nom, prix, quantite, categorie },
      error: "La quantité ne peut pas être négative"
    });
  }

  connection.query(
    `UPDATE produits 
     SET nom = ?, prix = ?, quantite = ?, categorie = ?
     WHERE id = ?`,
    [nom, prix, quantite, categorie, id],
    (err, result) => {
      if (err) throw err;

      res.redirect("/?success=modification_reussie");
    }
  );
});


app.get("/produits/:id/supprimer", (req, res) => {
  const id = req.params.id;

  connection.query(
    "delete from produits where id = ? and quantite = 0",
    [id],
    (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        return res.redirect(
          "/?error=Suppression interdite : le produit a encore du stock"
        );
      }

      res.redirect("/?success=Produit supprimé avec succès");
    }
  );
});

app.get("/ajouter", (req, res) => {
  res.render("ajouter.ejs", {
    error: null,
    success: null,
    values: {},
  });
});

app.post("/produits", (req, res) => {
  const { nom, prix, quantite, categorie } = req.body;

  const values = { nom, prix, quantite, categorie };

  if (!nom || !prix || !quantite || !categorie) {
    return res.render("ajouter.ejs", {
      error: "Tous les champs sont obligatoires.",
      success: null,
      values,
    });
  }

  if (prix <= 0) {
    return res.render("ajouter.ejs", {
      error: "Le prix doit être strictement supérieur à 0.",
      success: null,
      values,
    });
  }

  if (quantite < 0) {
    return res.render("ajouter.ejs", {
      error: "La quantité ne peut pas être négative.",
      success: null,
      values,
    });
  }

  connection.query(
    "insert into produits (nom, prix, quantite, categorie) values (?, ?, ?, ?)",
    [nom, prix, quantite, categorie],
    (err, result) => {
      if (err) throw err;

      res.render("ajouter.ejs", {
        error: null,
        success: `Produit ajouté avec succès (ID : ${result.insertId})`,
        values: {},
      });
    }
  );
});

app.get("/recherche", (req, res) => {
  const { categorie, prixMin, prixMax, stock } = req.query;

  let sql = "select * from produits where 1=1";
  let params = [];

  // Filtre catégorie
  if (categorie) {
    sql += " and categorie = ?";
    params.push(categorie);
  }

  // Prix minimum
  if (prixMin) {
    sql += " and prix >= ?";
    params.push(prixMin);
  }

  // Prix maximum
  if (prixMax) {
    sql += " and prix <= ?";
    params.push(prixMax);
  }

  // En stock uniquement
  if (stock === "on") {
    sql += " and quantite > 0";
  }

  connection.query(sql, params, (err, result) => {
    if (err) throw err;

    res.render("recherche.ejs", {
      produits: result,
      total: result.length,
      filtres: { categorie, prixMin, prixMax, stock }
    });
  });
});


app.listen(3000, () => {
  console.log("Le server écouter sur le port 3000");
});
