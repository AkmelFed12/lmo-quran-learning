const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  try {
    // Compter les utilisateurs
    const usersSnap = await db.collection('users').get();
    const totalUsers = usersSnap.size;

    // Compter les téléchargements (si vous avez une collection dédiée, sinon on laisse 0)
    // Pour l'instant on ne compte que les utilisateurs.

    // Mettre à jour ou créer le document stats/global
    const statsRef = db.collection('stats').doc('global');
    const statsDoc = await statsRef.get();

    if (statsDoc.exists) {
      // Mettre à jour uniquement totalUsers si déjà présent
      await statsRef.set({ totalUsers }, { merge: true });
    } else {
      // Créer avec des valeurs par défaut
      await statsRef.set({
        totalUsers,
        totalVisits: 0,
        totalDownloads: 0
      });
    }

    console.log(`Stats mises à jour : ${totalUsers} utilisateurs.`);
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la mise à jour des stats :', err);
    process.exit(1);
  }
})();