let api
const domain = 'meet.jit.si';
const options = {
roomName: '{{jitsi}}',
  width: '50%',
  height: '50%',
  parentNode: document.querySelector('#jitsi'),
  lang: 'en'
};

/**
 * 
 */
function loadGroupChat() {
  if (api === undefined) {
    loadScript('https://meet.jit.si/external_api.js', () => {
      api = new JitsiMeetExternalAPI(domain, options);
      document.getElementById('loadingJitsi').remove()
    })
  }
}
