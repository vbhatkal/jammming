let  accessToken = "",
     expiresIn = "";

const clientID  = "7841eae867b24a9c83e62ed2a172c5c0",
      redirectURI = "http://vai-jammming.surge.sh";

const Spotify = {

   getAccessToken () {

     const url = window.location.href,
           token = url.match(/access_token=([^&]*)/),
           time = url.match(/expires_in=([^&]*)/);

     if( accessToken ) {

       return accessToken;

     } else if ( token && time ) {

       accessToken = token[ 1 ];
       expiresIn = time[ 1 ];

       window.setTimeout(() => accessToken = '', expiresIn * 1000);
       window.history.pushState('Access Token', null, '/');

       return accessToken;

     } else {

       window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
       console.log("accessToken here", window.location)

     }
   },

   search ( searchTerm ) {

     this.getAccessToken();

     return fetch ( `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {

         headers: {
         Authorization: `Bearer ${accessToken}`

       }

     }).then( response => {

       if( response.ok ) {
         return response.json();
       }

       throw new Error( "Request failed!" );

     }).then( jsonResponse => {

       if( jsonResponse.tracks ) {

         return jsonResponse.tracks.items.map( track => {

           return {
             id : track.id,
             name : track.name,
             artist : track.artists[0].name,
             album : track.album.name,
             uri : track.uri
           }
         });

       } else {

         return [];

       }

     });

   },

   savePlaylist ( playlistName, trackURIs ) {

     let userId = "",
         playlistId = "";

     this.getAccessToken();

     if( playlistName && trackURIs ) {

     return fetch( `https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/me`, {
         headers : { Authorization: `Bearer ${accessToken}` }
       }).then( response => {

         if( response.ok ) {
           return response.json();
         }

         throw new Error( "Playlist Request failed!" );

       }, networkError => console.log(networkError.message)

     ).then( jsonResponse => {

         if ( jsonResponse.id ) {
           userId = jsonResponse.id;
         }

         return fetch( `https://api.spotify.com/v1/users/${userId}/playlists`, {
             headers: {'Content-type': 'application/json',
             Authorization: `Bearer ${accessToken}`},
             method : 'POST',
             body : JSON.stringify( { name : playlistName, description : 'new playlist description' } )

         }).then(response => {
             if( response.ok ) {
               return response.json();
             }

           console.log("response", response)
           throw new Error( "Get PlaylistId - Request failed!" );
         }, networkError => console.log(networkError.message)

       ).then( jsonResponse => {

           if( jsonResponse.id ) {
             playlistId = jsonResponse.id;
           }

           return fetch( `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
               headers: { Authorization: `Bearer ${accessToken}`},
               method : "POST",
               body : JSON.stringify( { uris : trackURIs } )

           }).then( response => {

               if( response.ok ) {
                 return response.json();
               }

           throw new Error( "Save Playlist - Request failed!" );

         }).then( jsonResponse => {
         });
       });
     });
   }
 }
};

export default Spotify;
