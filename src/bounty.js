// https://github.com/feross/simple-peer

// Create a Keystore
const keystore = {};

// Initialize Simple Peer Instances
const peers = [];

function loadBountySystem() {
  if (api === undefined) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.7.0/simplepeer.min.js', () => {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.3.2/peerjs.min.js', connectToPeers)
    })
  }
}

function newWay () {
  const peer = new SimplePeer({
    initiator: location.hash === '#initiator',
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:relay.webwormhole.io:3478' },
        { urls: 'stun:stun.nextcloud.com:443' }
      ]
    }
  });
  const peerId = getHash(seed, Math.random().toString());

  // Event: When the SimplePeer instance has signaling data to send
  peer.on('signal', (data) => {
    console.log('Generated signaling data:', data);

    // Share the signaling data with other peers using your preferred method (e.g., messaging, signaling channel, etc.)
    // For simplicity, we'll log it here and assume manual sharing between peers
  });

  // Event: When the SimplePeer instance receives data
  peer.on('data', (data) => {
    console.log('Received data:', data.toString());
  });

  // Connect to PeerJS signaling server
  const peerJS = new Peer(peerId);

  // Event: When PeerJS connection is open
  peerJS.on('open', () => {
    console.log('Connected to PeerJS signaling server');
    
    if (peer.initiator) {
      // You are the initiator, so call the other peer
      const otherPeerId = '<other-peer-id>'; // Replace with the ID of the peer you want to connect to
      const conn = peerJS.connect(otherPeerId);

      // Event: When PeerJS connection to the other peer is open
      conn.on('open', () => {
        console.log('Connected to the other peer');
        // Exchange signaling data directly between the peers
        conn.on('data', (data) => {
          peer.signal(data);
        });

        // Start exchanging data with the other peer
        peer.on('connect', () => {
          console.log('WebRTC connection established');
          peer.send('Hello, other peer!');
        });
      });
    } else {
      // You are not the initiator, so wait for the initiator's call
      peerJS.on('connection', (conn) => {
        console.log('Connected to the initiator');
        // Exchange signaling data directly between the peers
        conn.on('data', (data) => {
          peer.signal(data);
        });

        // Start exchanging data with the initiator
        peer.on('connect', () => {
          console.log('WebRTC connection established');
          peer.send('Hello, initiator!');
        });
      });
    }
  });
}





function discoverPeers() {
  // Simulated list of discovered peer IDs
  const discoveredPeers = ['peer1', 'peer2', 'peer3'];
  
  return discoveredPeers;
}

// Establish Connections
function connectToPeers() {
  const self = new SimplePeer({
    initiator: true,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:relay.webwormhole.io:3478' },
        { urls: 'stun:stun.nextcloud.com:443' }
      ]
    }
  });

  self.on('signal', data => {
    console.log('signal', data)
    // Send signaling data to the remote peer
    //sendSignalingData(peerData.id, data); // Implement this function
  });

  self.on('connect', () => {
    console.log('Connected to peer');

  });

  self.on('data', data => {
    console.log('data')
    handleKeystoreUpdate(JSON.parse(data)); // Implement this function
  });

  self.on('close', () => {
    console.log('Connection closed');
  });

  // Connect to signaling server and retrieve connection details
  const discoveredPeers = discoverPeers(); // Implement this function

  // Create a new SimplePeer instance for each peer in the network
  discoveredPeers.forEach(peerData => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:relay.webwormhole.io:3478' },
          { urls: 'stun:stun.nextcloud.com:443' }
        ]
      }
    });

    // Handle connection events
    peer.on('signal', data => {
      console.log('signal')
      // Send signaling data to the remote peer
      sendSignalingData(peerData.id, data); // Implement this function
    });

    peer.on('connect', () => {
      console.log('Connected to peer:', peerData.id);

    });

    peer.on('data', data => {
      console.log('data')
      handleKeystoreUpdate(JSON.parse(data)); // Implement this function
    });

    peer.on('close', () => {
      console.log('Connection closed:', peerData.id);
    });
  });
}




// Synchronize Keystore
function synchronizeKeystore() {
  // Broadcast the keystore update to all connected peers
  const keystoreUpdate = JSON.stringify(keystore);

  peers.forEach(peer => {
    peer.send(keystoreUpdate);
  });
}

function sendSignalingData(peerId, data) {
  // Simulated direct signaling data exchange between peers
  const peer = getPeerById(peerId); // Implement this function to get the SimplePeer instance by peerId
  peer.signal(data);
}

// Handle Keystore Updates
function handleKeystoreUpdate(updatedKeystore) {
  // Merge the received keystore update with the local keystore
  Object.assign(keystore, updatedKeystore);
  console.log('Keystore synchronized:', keystore);
}

// Broadcast Keystore Updates
function broadcastKeystoreUpdate() {
  const keystoreUpdate = JSON.stringify(keystore);
  peers.forEach(peer => {
    peer.send(keystoreUpdate);
  });
}

function updateKeystore(key, value) {
  // Update the local keystore
  keystore[key] = value;

  // Create a keystore update message
  const keystoreUpdate = JSON.stringify({ [key]: value });

  // Broadcast the keystore update to all connected peers
  peers.forEach(peer => {
    peer.send(keystoreUpdate);
  });
}

// Example Usage
//connectToPeers();

// Update the keystore
//keystore['key1'] = 'value1';
//broadcastKeystoreUpdate();
