import React from 'react'
import {Pagination} from 'react-bootstrap'
import * as actionCreator from '../actions'
import { connect } from 'react-redux';

const PaginationView = React.createClass({

  handleSelect(event, selectedEvent) {
    this.props.goto(selectedEvent.eventKey)
  },

  render() {
    var activePage;
    var items;
    if(this.props.collection && this.props.collection.query) {
      activePage = this.props.collection.query.pageOpt || 1;
      items = this.props.collection.query.limitOpt? Math.ceil(this.props.collection.totalCount / this.props.collection.query.limitOpt): 1
    } else {
      activePage = 1;
      items = 1;
    }
    if(items === 1) {
      return null;
    }
    return (
      <Pagination 
        prev
        next
        first
        last
        ellipsis
        boundaryLinks
        maxButtons={5}
        activePage={activePage}
        items={items}
        onSelect={this.handleSelect} {...this.props} />
    );
  }
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    goto: (pageId) => {
      dispatch(actionCreator.page.reload({pageId}))
    }
  }
}

const PaginationContainer = connect(null, mapDispatchToProps)(PaginationView)

export default PaginationContainer