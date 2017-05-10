var gcm = require('node-gcm');

// Set up the sender with your GCM/FCM API key (declare this once for multiple messages)
var sender = new gcm.Sender('AAAA9KoGNfU:APA91bHmG5U4CLayBCg_7_X8gKgrxxBh-eEe_-vCNSYhkb09WzIDBcwfHBpSaFwOlcx_CNXksPQ96d-_TN04K_T5YyTiGJu88c8OjBecWn8fjKvSQ2QdEDcXUd0SYYTTjMeWTbg0kgyu');

// Prepare a message to be sent
var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    dryRun: true,
    data: {
        key1: 'message1',
        key2: 'message2'
    },
    notification: {
        title: "Hello, World",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed if your app is in the background."
    }
});

// Specify which registration IDs to deliver the message to
var regTokens = ['cacWNmm4BEo:APA91bHBhfUnYNgsAQ6Pv94ZDgQ5XIj9rVU84UMVh_iYDiSW4vbVUazzEMeSO_FVHWCgOCDLOaYlRRYITDcKgPjRVVRi07n8mUpTu2kbozLIMXVaLJbkPQmS9WMdceAITFVZqb5B3yVU'];

// Actually send the message
sender.send(message, { registrationTokens: regTokens }, function(err, response) {
    if (err) console.error(err);
    else console.log(response);
});