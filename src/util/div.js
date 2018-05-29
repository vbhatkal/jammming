const clientID = '35e0f19b4fa04d70a816314b510d4b6b';
const redirectUri = 'http://divdesigns.surge.sh/';
let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        const url = window.location.href;
        const token = url.match(/access_token=([^&]*)/);
        const time = url.match(/expires_in=([^&]*)/);
        if (accessToken) {
            return accessToken;
        } else if (token && time) {
            accessToken = token[1];
            expiresIn = time[1];
            window.setTimeout(() => accessToken = null, expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
      return accessToken;
        } else {
          let accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;       }
    },

  search(term){
      this.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&limit=20&q=${term}`, {
        headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        if (response.ok) {
          return response.json();

        }
        throw new Error('Request Failed!');
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        if (jsonResponse.tracks.items) {
          console.log(jsonResponse);
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        } else {
          return [];
        }
      });
    },

    savePlaylist(name,trackList){
      this.getAccessToken();
      let userId;
      let playlistId;

      if(name && trackList){
        return fetch('https://api.spotify.com/v1/me', {
                headers: {Authorization: `Bearer ${accessToken}`}
              }).then(response => {
                  if (response.ok) {
                    return response.json();
                  }
              }).then(jsonResponse => {
                 userId =jsonResponse.id;

                 return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                                headers: {'Content-type': 'application/json',
                                Authorization: `Bearer ${accessToken}`},
                                method: 'POST',
                                body: JSON.stringify({name: name,description : 'new playlist description'})
               }).then(response => {
                    if (response.ok) {
                      return response.json();
                    }
                  }).then((data)=>{
                    playlistId = data.id;

                    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                                  headers: {"Content-type": "application/json",
                                  Authorization: `Bearer ${accessToken}`},
                                  method: 'POST',
                                  body: JSON.stringify({uris: trackList})
                                }).then((response)=>{
                                  if (response.ok) {
                                    return response.json();
                                  }
                                }).then((response)=>{
                                    console.log(response.snapshot_id);
                                });
                  });
              });
        }
    }
 };
export default Spotify;



// WEBPACK FOOTER //
// ./src/util/Spotify.js
