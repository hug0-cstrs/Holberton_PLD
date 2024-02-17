const dejaJouesQuestions = []; // Liste des questions déjà jouées
const dejaJouesJoueurs = []; // Liste des joueurs déjà joués

let questions = []; // Liste des questions
let joueurs = []; // Liste des joueurs

// Fonction pour tirer un élément au sort et le retirer du tableau
function tirerAuSort(tableau) {
  const indexAleatoire = Math.floor(Math.random() * tableau.length); // Génère un index aléatoire
  const element = tableau.splice(indexAleatoire, 1)[0]; // Retire l'élément du tableau
  return element;
}

// Fonction pour afficher le jeu
async function afficherJeu() {
  // Assurez-vous que les questions ont été chargées avant de procéder
  if (questions.length === 0 || joueurs.length === 0) {
    afficherMessage("Veuillez sélectionner une semaine pour charger les questions.");
    return;
  }

  const question = tirerAuSort(questions); // Tirage au sort d'une question
  const joueur = tirerAuSort(joueurs); // Tirage au sort d'un joueur

  dejaJouesQuestions.push(question); // Ajout de la question à la liste des questions déjà jouées
  dejaJouesJoueurs.push(joueur); // Ajout du joueur à la liste des joueurs déjà joués

  // Affichage de la question et du joueur
  document.getElementById("joueur").innerHTML = `<h2>${joueur}</h2>`;
  document.getElementById("question").innerHTML = `<h2>${question}</h2>`;
}

// Fonction pour afficher une boîte de dialogue personnalisée
function afficherMessage(message) {
  document.getElementById("custom-alert-message").innerText = message;
  document.getElementById("custom-alert").style.display = "block";
}

// Ecouteur d'événement sur le bouton OK de la boîte de dialogue
document.getElementById("custom-alert-button").addEventListener("click", () => {
  document.getElementById("custom-alert").style.display = "none";
});

// Charger les données initiales pour la semaine sélectionnée
document.addEventListener("DOMContentLoaded", async function() {
  // Vérifiez s'il y a déjà une semaine sélectionnée enregistrée dans le stockage local
  const selectedWeek = localStorage.getItem("selectedWeek") || 1;
  document.getElementById("selectQuiz").value = selectedWeek;

  await chargerDonnees(selectedWeek);
  lancerJeu(); // Lance le jeu après le chargement des données
});

// Ecouteur d'événement pour détecter les changements dans la sélection de semaine
document.getElementById("selectQuiz").addEventListener("change", async function() {
  const selectedWeek = this.value;
  localStorage.setItem("selectedWeek", selectedWeek);
  await chargerDonnees(selectedWeek);
});

// Fonction pour charger les données
async function chargerDonnees(selectedWeek) {
  const questionsData = await chargerJSON(`json_db/questions_week${selectedWeek}.json`);
  questions = questionsData.questions;

  const joueursData = await chargerJSON("json_db/prenoms.json");
  joueurs = joueursData.prenoms;

  // Appel à afficherJeu() uniquement après le chargement des données
  afficherJeu();
}

// Fonction pour charger les données JSON
async function chargerJSON(url) {
  const response = await fetch(url);
  return await response.json();
}

// Fonction pour lancer le jeu
async function lancerJeu() {
  // Ecouteur d'événement sur le bouton "Commencer"
  document.getElementById("bouton").addEventListener("click", async () => {
    if (questions.length === 0 || joueurs.length === 0) {
      afficherMessage("No more questions for today!\n\nWishing everyone a wonderful rest of the day :)");
      return;
    }
    await afficherJeu(); // Affiche la question suivante
  });
}
