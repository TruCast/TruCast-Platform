let ready_for_call = false;
// const room = location.search && location.search.split('?')[1];
const webrtc = new SimpleWebRTC({ // eslint-disable-line
  localVideoEl: 'videos',
  remoteVideosEl: '',
  media: {
    video: {
      width: 1280,
      height: 720
    },
    audio: false
  },
  autoRequestMedia: true,
  autoRemoveVideos: true
});

/* function setRoom(name) {
  $('form').remove();
  $('h1').text(name);
  $('#subTitle').text('Link to join: ' + location.href);
  $('body').addClass('active');
}

if (room) {
  setRoom(room);
} else {
    $('form').submit(function () {
      const val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
      webrtc.createRoom(val, function (err, name) {
        console.log(' create room cb', arguments);

        const newUrl = location.pathname + '?' + name;
        if (!err) {
          history.replaceState({foo: 'bar'}, null, newUrl);
          setRoom(name);
        } else {
            console.log(err);
        }
      });
      return false;
    });
}*/

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
  if (ready_for_call) return joinRoom();
  webrtc.on('readyToCall', () => joinRoom());
});
