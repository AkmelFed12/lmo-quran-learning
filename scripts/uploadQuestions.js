const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
const BATCH_SIZE = 400;

async function uploadInBatches() {
    let batch = db.batch();
    let count = 0;
    for (const q of questions) {
        const ref = db.collection('questionsBank').doc(q.id.toString());
        batch.set(ref, q);
        count++;
        if (count % BATCH_SIZE === 0) {
            await batch.commit();
            batch = db.batch();
            console.log(`${count} questions téléversées...`);
        }
    }
    if (count % BATCH_SIZE !== 0) await batch.commit();
    console.log('Téléversement terminé. Total :', count);
}

uploadInBatches().catch(console.error);