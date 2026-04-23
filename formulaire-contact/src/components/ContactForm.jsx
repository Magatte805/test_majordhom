import { useState } from "react";

function ContactForm() {

  /*ÉTAT DU FORMULAIRE*/
  const [formData, setFormData] = useState({
    title: "Mr",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    disponibilites: [],
    typeDemande: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  /*ÉTAT DES DISPONIBILITÉS*/
  const [dispo, setDispo] = useState({
    jour: "",
    heure: "",
    minute: ""
  });

  const [listDispo, setListDispo] = useState([]);
  const [dispoError, setDispoError] = useState("");

  /*GESTION DES CHAMPS DU FORMULAIRE*/
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  /*AJOUT D'UNE DISPONIBILITÉ */
  const handleAddDispo = () => {
    if (!dispo.jour || !dispo.heure || !dispo.minute) {
      setDispoError("Veuillez choisir le jour, l'heure et les minutes");
      return;
    }

    setDispoError("");

    const newItem = `${dispo.jour} à ${dispo.heure}h${dispo.minute}`;

    setListDispo((prev) => [...prev, newItem]);
  };

  /*SUPPRESSION D'UNE DISPONIBILITÉ*/
  const handleDeleteDispo = (index) => {
    setListDispo((prev) => prev.filter((_, i) => i !== index));
  };

  /*VALIDATION DU FORMULAIRE */
  const validate = () => {
    let newErrors = {};

    // champs obligatoires
    if (!formData.nom) newErrors.nom = "Nom obligatoire";
    if (!formData.prenom) newErrors.prenom = "Prénom obligatoire";

    // email
    if (!formData.email) {
      newErrors.email = "Email obligatoire";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Email invalide";
    }

    // téléphone
    if (!formData.telephone) {
      newErrors.telephone = "Téléphone obligatoire";
    }

    // type de demande (radio)
    if (!formData.typeDemande) {
      newErrors.typeDemande = "Veuillez choisir une option";
    }

    // message
    if (!formData.message) {
      newErrors.message = "Veuillez écrire un message";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ENVOI DU FORMULAIRE (BACKEND)*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");

    // validation générale
    if (!validate()) return;

    // vérification disponibilité
    if (listDispo.length === 0) {
      setDispoError("Veuillez ajouter au moins une disponibilité");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          disponibilites: listDispo
        })
      });

      const data = await response.json();
      console.log("SUCCÈS :", data);

      // message de succès dans la page
      setSuccessMessage(
        "Message envoyé, nous reviendrons vers vous dans les meilleurs délais."
      );

      // reset formulaire
      setFormData({
        title: "Mr",
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        disponibilites: [],
        typeDemande: "",
        message: ""
      });

      setListDispo([]);
      setDispo({ jour: "", heure: "", minute: "" });

    } catch (error) {
      console.error("ERREUR :", error);
      setSuccessMessage("Erreur lors de l'envoi du formulaire.");
    }
  };

  /* AFFICHAGE */
  return (
    <div className="page">

      {/* TITRE */}
      <h1 className="page-title">Contacter l'agence</h1>
      <h4 className="section-title">Vos coordonnées</h4>

      <form className="container" onSubmit={handleSubmit}>

        {/*COLONNE GAUCHE*/}
        <div className="left">

          {/* CIVILITÉ */}
          <div className="radio-group-inline">
            <label>
              <input
                type="radio"
                name="title"
                value="Mr"
                checked={formData.title === "Mr"}
                onChange={handleChange}
              />
              Mr
            </label>

            <label>
              <input
                type="radio"
                name="title"
                value="Mrs"
                checked={formData.title === "Mrs"}
                onChange={handleChange}
              />
              Mrs
            </label>
          </div>

          {/* NOM / PRÉNOM */}
          <div className="row">
            <div>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
              />
              {errors.nom && <p className="error">{errors.nom}</p>}
            </div>

            <div>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
              />
              {errors.prenom && <p className="error">{errors.prenom}</p>}
            </div>
          </div>

          {/* EMAIL */}
          <div className="field">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* TÉLÉPHONE */}
          <div className="field">
            <input
              type="text"
              name="telephone"
              placeholder="Téléphone"
              value={formData.telephone}
              onChange={handleChange}
            />
            {errors.telephone && <p className="error">{errors.telephone}</p>}
          </div>

          {/* DISPONIBILITÉS */}
          <h4>Disponibilités pour une visite</h4>

          <div className="dispo-wrapper">

            <div className="row-select">

              <select
                className="big-select"
                onChange={(e) => setDispo({ ...dispo, jour: e.target.value })}
              >
                <option>Jour</option>
                <option>Lundi</option>
                <option>Mardi</option>
                <option>Mercredi</option>
                <option>Jeudi</option>
                <option>Vendredi</option>
                <option>Samedi</option>
                <option>Dimanche</option>
              </select>

              <select
                className="small-select"
                onChange={(e) => setDispo({ ...dispo, heure: e.target.value })}
              >
                <option>Heure</option>
                <option>09</option>
                <option>11</option>
                <option>12</option>
                <option>13</option>
                <option>14</option>
              </select>

              <select
                className="small-select"
                onChange={(e) => setDispo({ ...dispo, minute: e.target.value })}
              >
                <option>Min</option>
                <option>00</option>
                <option>15</option>
                <option>30</option>
                <option>45</option>
              </select>

              <button type="button" className="add-btn" onClick={handleAddDispo}>
                Ajouter Dispo
              </button>

            </div>

            {dispoError && <p className="error-dispo">{dispoError}</p>}
          </div>

          {/* LISTE DISPONIBILITÉS */}
          <div>
            {listDispo.map((item, index) => (
              <p key={index}>
                {item}
                <span onClick={() => handleDeleteDispo(index)}> ❌</span>
              </p>
            ))}
          </div>

        </div>

        {/* COLONNE DROITE*/}
        <div className="right">

          <h4 className="section-title">Votre message</h4>

          {/* TYPE DE DEMANDE */}
          <div className="radio-group-inline">

            <label>
              <input
                type="radio"
                name="typeDemande"
                value="visite"
                checked={formData.typeDemande === "visite"}
                onChange={handleChange}
              />
              Demande de Visite
            </label>

            <label>
              <input
                type="radio"
                name="typeDemande"
                value="appel"
                checked={formData.typeDemande === "appel"}
                onChange={handleChange}
              />
              Étre rappelé(e)
            </label>

            <label>
              <input
                type="radio"
                name="typeDemande"
                value="photo"
                checked={formData.typeDemande === "photo"}
                onChange={handleChange}
              />
              Plus de photos
            </label>

          </div>

          {errors.typeDemande && <p className="error">{errors.typeDemande}</p>}

          {/* MESSAGE */}
          <textarea
            className="message-box"
            name="message"
            rows="8"
            placeholder="Votre message..."
            value={formData.message}
            onChange={handleChange}
          />

          {errors.message && <p className="error">{errors.message}</p>}

          {/* MESSAGE DE SUCCÈS */}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          {/* BOUTON ENVOI */}
          <div className="btn-wrapper">
            <button type="submit" className="send-btn">
              Envoyer
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}

export default ContactForm;