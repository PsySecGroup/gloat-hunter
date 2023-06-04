const channelName = (`
{{target}}
`.trim())+`-${seed}`

let pubnub

function loadPubnub (channel) {
  if (pubnub === undefined) {
    loadScript('https://cdn.pubnub.com/sdk/javascript/pubnub.7.1.2.min.js', () => {
      pubnub = new PubNub({
        publishKey : atob('cHViLWMtMWQ3ZmI5ZDgtYzYzZC00NmNjLTk3ZTQtY2UwMTE3YjRkYWE2'),
        subscribeKey : atob('c3ViLWMtMDM0Y2UzZjgtOGFlZS00NzIzLTg4MTktY2NmODdjOTMwYTk0'),
        userId: getUniqueId()
      });

      const listener = {
        status: (statusEvent) => {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("Connected");
            }
        },

        message: (messageEvent) => {
            showMessage(messageEvent.message.description);
        },

        presence: (presenceEvent) => {
            // handle presence
            console.log(presenceEvent)
        }
      };

      pubnub.addListener(listener);

      pubnub.subscribe({
        channels: [channelName]
      });
    })
  }
}

const publishMessage = async (channel, message) => {
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    const publishPayload = {
      channel,
      message: {
        title: '',
        description: message
      }
    };

    await pubnub.publish(publishPayload);
}
