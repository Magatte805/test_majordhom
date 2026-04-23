const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

//Chemin du fichier JSON où les données seront stockées
const FILE_PATH = __dirname + "/data.json";


// Fonction pour lire les données existantes dans le fichier JSON
const readData = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");

  if (!data) return [];

  return JSON.parse(data);
};


//Fonction pour écrire dans le fichier JSON
const writeData = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};


//Route POST pour recevoir le formulaire
app.post("/form", (req, res) => {
  try {
    // On récupère les anciennes données
    const currentData = readData();

    // On ajoute le nouveau formulaire
    currentData.push(req.body);

    // On sauvegarde dans le fichier JSON
    writeData(currentData);

    console.log("DATA AJOUTÉE :", req.body);

    // Réponse envoyée au frontend
    res.json({
      success: true,
      message: "Données enregistrées avec succès",
      data: req.body
    });

  } catch (error) {
    console.error("ERREUR SERVEUR :", error);

    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'enregistrement"
    });
  }
});


//Lancement du serveur
app.listen(PORT, () => {
  console.log("Serveur lancé sur http://localhost:" + PORT);
});