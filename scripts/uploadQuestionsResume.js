const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const questions = JSON.parse(fs.readFileSync('questions.json', 'utf8'));
const BATCH_SIZE = 400;
const START_INDEX = 20000; // reprendre après 20 000

async function uploadFrom(index) {
    let batch = db.batch();
    let count = 0;
    for (let i = index; i < questions.length; i++) {
        const q = questions[i];
        const ref = db.collection('questionsBank').doc(q.id.toString());
        batch.set(ref, q);
        count++;
        if (count % BATCH_SIZE === 0) {
            await batch.commit();
            batch = db.batch();
            console.log(`${i + 1} questions traitées...`);
        }
    }
    if (count % BATCH_SIZE !== 0) await batch.commit();
    console.log('Téléversement terminé. Total ajouté :', count);
}

uploadFrom(START_INDEX).catch(console.error);