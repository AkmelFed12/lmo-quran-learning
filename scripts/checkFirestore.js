const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

(async () => {
  const collections = ['users', 'progress', 'memorization', 'forum', 'testimonials', 'questionsBank', 'dailyQuizzes', 'rankings'];
  for (const name of collections) {
    const snap = await db.collection(name).limit(1).get();
    console.log(`${name}: ${snap.empty ? 'vide' : 'ok'} (${snap.size} docs)`);
  }
  process.exit(0);
})();