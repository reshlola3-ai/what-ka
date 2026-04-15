const https = require('https');
https.get('https://reshlola3-ai.github.io/what-ka/models/tiny_face_detector_model-weights_manifest.json', (res) => {
    console.log(`JSON Status: ${res.statusCode}`);
});
https.get('https://reshlola3-ai.github.io/what-ka/models/tiny_face_detector_model-shard1', (res) => {
    console.log(`Shard Status: ${res.statusCode}`);
});
