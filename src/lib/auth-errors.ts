import { FirebaseError } from "firebase/app";

const authErrorMessages: Record<string, string> = {
  "permission-denied": "Le profil n'a pas pu être enregistré. Veuillez réessayer dans quelques instants.",
  unavailable: "Le service est momentanément indisponible. Veuillez réessayer.",
  "auth/email-already-in-use": "Cette adresse e-mail est déjà utilisée. Connectez-vous ou réinitialisez le mot de passe.",
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/invalid-email": "Adresse e-mail invalide.",
  "auth/network-request-failed": "La connexion réseau semble instable. Vérifiez Internet puis réessayez.",
  "auth/operation-not-allowed": "Ce mode de connexion n'est pas encore activé dans Firebase Authentication.",
  "auth/popup-closed-by-user": "La fenêtre Google a été fermée avant la fin de la connexion.",
  "auth/too-many-requests": "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
  "auth/unauthorized-domain": "Le domaine du site n'est pas autorisé dans Firebase Authentication.",
  "auth/user-not-found": "E-mail ou mot de passe incorrect.",
  "auth/weak-password": "Choisissez un mot de passe d'au moins 6 caractères.",
  "auth/wrong-password": "E-mail ou mot de passe incorrect.",
};

export function getFirebaseAuthMessage(error: unknown, fallback = "Connexion impossible pour le moment.") {
  if (error instanceof FirebaseError && authErrorMessages[error.code]) {
    return authErrorMessages[error.code];
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
