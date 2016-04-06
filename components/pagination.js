import React from 'react'
import {Pagination} from 'react-bootstrap'
const PaginationContainer = React.createClass({
  getInitialState() {
    return {
      activePage: 1
    };
  },

  handleSelect(event, selectedEvent) {
    this.setState({
      activePage: selectedEvent.eventKey
    });
  },

  render() {
    return (
      <Pagination 
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={5}
        activePage={this.state.activePage}
        onSelect={this.handleSelect} {...this.props} />
    );
  }
});

export default PaginationContainer