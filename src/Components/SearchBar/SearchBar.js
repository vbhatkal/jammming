import React from "react";
import "./SearchBar.css"

let searchTerm = "";

class SearchBar extends React.Component {

  constructor ( props ) {

    super( props );
    this.handleSearch =  this.handleSearch.bind( this );
    this.handleTermChange = this.handleTermChange.bind( this );
    this.handleKeyPress = this.handleKeyPress.bind( this );

  }

  handleSearch ( event ) {

    searchTerm = this.state.searchTerm;

    console.log("handleSearch", event, searchTerm)

    if( !searchTerm ) {

      return;

    }

    this.props.onSearch ( this.state.searchTerm );

  }

  handleTermChange(event){

    this.setState( { searchTerm: event.target.value})
  }

  handleKeyPress ( event ) {

    if (event.key === 'Enter') {
      this.setState( { searchTerm: event.target.value})
      this.handleSearch( event );
   }

  }

  render () {

    console.log("searchTerm", searchTerm)
    return (

      <div className="SearchBar">

        <input id = "searchInput" placeholder= { searchTerm || "Enter A Song, Album, or Artist" }
              onChange = { this.handleTermChange }
              onKeyPress = { this.handleKeyPress }
        />


        <a onClick = { this.handleSearch } >SEARCH</a>

      </div>

    )

  }

}

export default SearchBar;
