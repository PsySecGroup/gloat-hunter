// https://github.com/feross/simple-peer

let peers

/**
 * 
 */
function loadBountySystem() {
  if (api === undefined) {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/simple-peer/9.7.0/simplepeer.min.js', () => {
      peers = new SimplePeer({
        initiator: false,
        trickle: false,
        config: {
          iceServers: [
            { urls: 'stun:relay.webwormhole.io:3478' },
            { urls: 'stun:stun.nextcloud.com:443' }
          ]
        },
      })

      // @TODO figure this out!
      peers.on('error', console.error)

      peers.on('signal', data => {
        console.log('SIGNAL', data)
        peers.signal(data)
      })

      peers.on('connect', () => {
        console.log('CONNECT')
        peers.send('whatever' + Math.random())
      })

      peers.on('data', data => {
        console.log('data: ' + data)
      })

      //document.getElementById('loadingBounty').remove()
    })
  }
}
