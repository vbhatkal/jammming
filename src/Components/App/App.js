import React from 'react';
import './background_photo_desktop.jpg';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';

class App extends React.Component {

  constructor ( props ) {

    super( props );

    this.state = {

        searchResults : [ ],
        playlistName : "New Playlist",
        playlistTracks : [ ]

       };

    this.addTrack = this.addTrack.bind( this );
    this.removeTrack = this.removeTrack.bind( this );
    this.updatePlaylistName = this.updatePlaylistName.bind( this );
    this.savePlaylist = this.savePlaylist.bind( this );
    this.search = this.search.bind( this );

  }

  // adds a track to the playlist
  addTrack ( track ) {

    let tracks = this.state.playlistTracks,
      hasTrack = tracks.find( savedTrack => {

      return savedTrack.id === track.id;

    });

    if ( !hasTrack ) {

      tracks.push( track );
      this.setState( { playlistTracks : tracks } );

    }

  }


  // remove a track from the playlist
  removeTrack ( track ) {

    let tracks = this.state.playlistTracks,
      hasTrack = null,
      newTracks = [];

    hasTrack = tracks.find( savedTrack => {

      return savedTrack.id === track.id;

    });

    if ( hasTrack ) {

        newTracks = tracks.filter( savedTrack => {

            return savedTrack.id !== track.id;

        });

      this.setState( { playlistTracks : newTracks } );

    }

  }


  // updates playlistName
  updatePlaylistName ( name ) {

    this.setState( { playlistName : name } );

  }

  // saves playlist to SPOTIFY
  savePlaylist () {

    const trackURIs = this.state.playlistTracks.map( track => track.uri );

    Spotify.savePlaylist( this.state.playlistName, trackURIs )

    this.setState( {

      playlistName : "New Playlist",
      playlistTracks : [ ]

    });

    console.log("this.setState", this.state.playlistName, this.state.playlistTracks)


  }

  // updates `searchResults` parameter with user's search results
  search ( searchTerm ) {

    if( !searchTerm ) {

      return;

    }
    console.log( "Search Term", searchTerm );

    Spotify.search ( searchTerm ).then( searchResults => {
      this.setState( { searchResults : searchResults } )
    });

  }

  render () {

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          < SearchBar onSearch = { this.search } />
          <div className="App-playlist">

            < SearchResults searchResults = { this.state.searchResults }
                            onAdd = { this.addTrack } />

            < Playlist playlistName = { this.state.playlistName }
                       playlistTracks = { this.state.playlistTracks }
                       onRemove = { this.removeTrack }
                       onNameChange = { this.updatePlaylistName }
                       onSave = { this.savePlaylist }
              />
          </div>
        </div>
      </div>
    );

  }
}

export default App;
