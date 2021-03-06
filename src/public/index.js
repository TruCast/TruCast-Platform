let ready_for_call = false;
const room = location.search && location.search.split('?')[1];
const webrtc = new SimpleWebRTC({ // eslint-disable-line
  url: 'https://trucast-signalserver.herokuapp.com',
  localVideoEl: 'videos',
  remoteVideosEl: 'videos',
  media: {
    video: {
      width: 1280,
      height: 720
    },
    audio: false
  },
  autoRequestMedia: false
  // autoRemoveVideos: true
});

function setRoom(name) {
  $('#createRoom').remove();
  $('#roomLink').text('Link For Others To Join: ' + location.href);
  $('#obsLink').text('Link For OBS Browser Source: https://trucast-platform.herokuapp.com/stream');
  $('#obsSpecs').text('OBS Browser Source Specs: Width=1280 Height=720 FPS=30 or 60 CSS=as is');
  $('body').addClass('active');
}

if (room) {
  setRoom(room);
} else {
  $('form').submit(function() {
    const val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
    webrtc.createRoom(val, function(err, name) {
      console.log(' create room cb', arguments);

      const newUrl = location.pathname + '?' + name;
      if (!err) {
        history.pushState({foo: 'bar'}, null, newUrl);
        setRoom(name);
      } else {
        console.log(err);
      }
    });
    return false;
  });
}

webrtc.on('readyToCall', function() {
  ready_for_call = true;
});

function joinRoom() {
  $('#status').text('Connecting...');
  webrtc.webrtc.config.nick = $('#nick_input').val();
  webrtc.joinRoom(window.channel_id);
  webrtc.on('joinedRoom', function() {
    $('#status').text('Connected');
  });
}

$('#connect_btn').click(e => {
  e.preventDefault();
  webrtc.startLocalVideo();
  if (ready_for_call) return joinRoom();
  webrtc.on('readyToCall', () => joinRoom());
});
