const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.pruneOldMessages = functions.pubsub.schedule('every 60 minutes').onRun(async (context) => {
  const cutoff = Date.now() - 12 * 60 * 60 * 1000;
  const db = admin.database();
  const ref = db.ref('messages');
  const snapshot = await ref.orderByChild('time').endAt(cutoff).once('value');
  const updates = {};
  snapshot.forEach(child => {
    updates[child.key] = null;
  });
  if(Object.keys(updates).length) {
    await ref.update(updates);
    console.log('Deleted', Object.keys(updates).length, 'old messages');
  } else {
    console.log('No old messages to delete');
  }
  return null;
});
