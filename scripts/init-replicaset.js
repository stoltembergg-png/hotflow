const { MongoClient } = require('mongodb');

async function init() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient('mongodb://localhost:27017/?directConnection=true');
  
  try {
    await client.connect();
    console.log('Connected! Initializing replica set...');
    
    const admin = client.db().admin();
    const status = await admin.command({ replSetGetStatus: 1 }).catch(() => null);
    
    if (status && status.ok === 1) {
      console.log('Replica set already initialized!');
    } else {
      await admin.command({
        replSetInitiate: {
          _id: 'rs0',
          members: [{ _id: 0, host: 'localhost:27017' }]
        }
      });
      console.log('Replica set initiated! Waiting 5s for election...');
      await new Promise(r => setTimeout(r, 5000));
      console.log('Done!');
    }
  } catch (e) {
    console.log('Note:', e.message);
  } finally {
    await client.close();
  }
}

init();
