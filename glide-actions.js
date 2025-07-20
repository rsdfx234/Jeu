// Actions personnalisées pour l'application Code Cuillère
// À intégrer dans Glide Apps via les Custom Actions

/**
 * 1. VÉRIFICATION DE RÉPONSE
 * Compare la réponse du joueur avec les réponses acceptées
 */
function checkAnswer(userAnswer, correctAnswer, alternativeAnswers) {
  // Normaliser la réponse de l'utilisateur
  const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '');

  // Normaliser la réponse correcte
  const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]/g, '');

  // Vérifier la réponse principale
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }

  // Vérifier les réponses alternatives
  if (alternativeAnswers) {
    const alternatives = alternativeAnswers.split('|');
    for (const alt of alternatives) {
      const normalizedAlt = alt.toLowerCase().trim()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '');
      
      if (normalizedUserAnswer === normalizedAlt) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 2. GÉNÉRATION D'ID JOUEUR
 * Crée un identifiant unique pour chaque nouveau joueur
 */
function generatePlayerId(rowNumber) {
  const prefix = "CU";
  const paddedNumber = String(rowNumber).padStart(3, '0');
  return `${prefix}${paddedNumber}`;
}

/**
 * 3. PROGRESSION AUTOMATIQUE
 * Met à jour la progression du joueur après une bonne réponse
 */
function updatePlayerProgress(playerId, currentPuzzle, isCorrect, userAnswer) {
  if (!isCorrect) {
    // Log de la mauvaise réponse
    logPlayerResponse(playerId, currentPuzzle, userAnswer, false);
    return {
      success: false,
      message: "❌ Réponse incorrecte. Réessayez ou demandez un indice !",
      nextPuzzle: currentPuzzle
    };
  }

  // Log de la bonne réponse
  logPlayerResponse(playerId, currentPuzzle, userAnswer, true);

  const nextPuzzle = currentPuzzle + 1;
  const now = new Date().toISOString();

  if (nextPuzzle > 7) {
    // Joueur a terminé toutes les énigmes
    return {
      success: true,
      message: "🎉 Félicitations ! Vous avez résolu toutes les énigmes ! Vous êtes maintenant qualifié pour le tirage au sort de 100 000 F CFA !",
      nextPuzzle: 7,
      isFinalist: true,
      completionDate: now
    };
  } else {
    return {
      success: true,
      message: `✅ Bonne réponse ! Énigme ${currentPuzzle} résolue. Place à l'énigme #${String(nextPuzzle).padStart(3, '0')} !`,
      nextPuzzle: nextPuzzle,
      isFinalist: false,
      lastActivity: now
    };
  }
}

/**
 * 4. LOG DES RÉPONSES
 * Enregistre toutes les tentatives des joueurs
 */
function logPlayerResponse(playerId, puzzleNumber, userAnswer, isCorrect) {
  const now = new Date().toISOString();
  
  // Cette fonction sera liée à Google Sheets via Glide
  return {
    id_joueur: playerId,
    numero_enigme: puzzleNumber,
    reponse_soumise: userAnswer,
    est_correcte: isCorrect,
    date_soumission: now,
    ip_adresse: "", // À remplir par Glide si disponible
    temps_reponse: 0 // À calculer par Glide
  };
}

/**
 * 5. GESTION DES PAIEMENTS
 * Crée une demande de paiement pour un indice
 */
function requestPayment(playerId, playerName, playerWhatsApp, puzzleNumber, requestType) {
  const amounts = {
    "indice_bonus": 100,
    "mega_indice": 200,
    "reponse": 500
  };

  const amount = amounts[requestType] || 0;
  const now = new Date().toISOString();

  return {
    id_joueur: playerId,
    nom_joueur: playerName,
    whatsapp_joueur: playerWhatsApp,
    numero_enigme: puzzleNumber,
    type_demande: requestType,
    montant: amount,
    date_demande: now,
    statut_paiement: "En attente",
    capture_ecran: "",
    date_validation: "",
    admin_validateur: "",
    notes: `Demande automatique pour ${requestType} - Énigme #${puzzleNumber}`
  };
}

/**
 * 6. TIRAGE AU SORT
 * Sélectionne aléatoirement un gagnant parmi les finalistes
 */
function conductLottery(finalists) {
  if (!finalists || finalists.length === 0) {
    return {
      success: false,
      message: "Aucun finaliste disponible pour le tirage au sort."
    };
  }

  // Génération aléatoire sécurisée
  const randomIndex = Math.floor(Math.random() * finalists.length);
  const winner = finalists[randomIndex];
  const now = new Date().toISOString();

  return {
    success: true,
    winner: winner,
    winnerIndex: randomIndex,
    totalFinalists: finalists.length,
    drawDate: now,
    method: "JavaScript Math.random()",
    prizeAmount: 100000,
    message: `🏆 Félicitations ${winner.nom} ! Vous avez remporté le grand prix de 100 000 F CFA !`
  };
}

/**
 * 7. VALIDATION DES DONNÉES
 * Vérifie la validité des données saisies
 */
function validateUserData(name, whatsapp, email) {
  const errors = [];

  // Validation du nom
  if (!name || name.trim().length < 2) {
    errors.push("Le nom doit contenir au moins 2 caractères");
  }

  // Validation du WhatsApp
  const whatsappRegex = /^(\+223|223|00223)?[0-9]{8}$/;
  if (!whatsapp || !whatsappRegex.test(whatsapp.replace(/\s/g, ''))) {
    errors.push("Le numéro WhatsApp doit être un numéro malien valide");
  }

  // Validation de l'email (optionnel)
  if (email && email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("L'email n'est pas au format valide");
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    normalizedData: {
      name: name.trim(),
      whatsapp: whatsapp.replace(/\s/g, '').replace(/^(223|00223)/, '+223'),
      email: email ? email.trim().toLowerCase() : ''
    }
  };
}

/**
 * 8. CALCUL DU SCORE
 * Calcule le score total d'un joueur
 */
function calculatePlayerScore(solvedPuzzles, paymentTotal) {
  const basePoints = solvedPuzzles * 100; // 100 points par énigme
  const bonusPoints = Math.max(0, 700 - paymentTotal); // Bonus pour moins de paiements
  const totalScore = basePoints + bonusPoints;

  return {
    basePoints: basePoints,
    bonusPoints: bonusPoints,
    totalScore: totalScore,
    maxPossible: 700
  };
}

/**
 * 9. FORMATAGE DES MESSAGES
 * Formate les messages pour l'interface utilisateur
 */
function formatGameMessage(messageType, data) {
  const messages = {
    welcome: `🎯 Bienvenue ${data.name} dans l'univers du Code Cuillère ! Votre ID joueur est ${data.playerId}. Résolvez toutes les énigmes et remportez 100 000 F CFA !`,
    
    correct_answer: `✅ Excellente réponse ! L'énigme #${String(data.currentPuzzle).padStart(3, '0')} est résolue. ${data.nextPuzzle <= 7 ? `Place à l'énigme #${String(data.nextPuzzle).padStart(3, '0')} !` : 'Vous êtes maintenant finaliste !'}`,
    
    wrong_answer: `❌ Ce n'est pas la bonne réponse. Réfléchissez encore ou demandez un indice !`,
    
    finalist: `🏆 Félicitations ! Vous avez résolu toutes les énigmes ! Vous participez maintenant au tirage au sort pour remporter 100 000 F CFA !`,
    
    payment_instructions: `💳 **Instructions de paiement pour ${data.requestType}**\n\n➤ Montant : ${data.amount} F CFA\n➤ Envoyez au : 00223 70 44 67 50\n➤ Méthodes : Orange Money ou Wave\n➤ Puis envoyez la capture sur WhatsApp\n\n*Vous recevrez votre ${data.requestType} après validation.*`,
    
    lottery_winner: `🎉 GRAND GAGNANT ! ${data.winnerName} remporte 100 000 F CFA ! Tirage effectué le ${data.drawDate} parmi ${data.totalFinalists} finalistes.`
  };

  return messages[messageType] || "Message non défini";
}

/**
 * 10. EXPORT POUR GLIDE
 * Fonctions à utiliser dans Glide Custom Actions
 */
const GlideActions = {
  checkAnswer,
  generatePlayerId,
  updatePlayerProgress,
  logPlayerResponse,
  requestPayment,
  conductLottery,
  validateUserData,
  calculatePlayerScore,
  formatGameMessage
};

// Export pour utilisation dans Glide
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GlideActions;
}