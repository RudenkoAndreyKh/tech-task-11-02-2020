import React, { Component, } from 'react';
import Router from './containers/navigation'

interface Props {

};

interface State {

}

class App extends Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {

    }
  }

  render() {
    console.disableYellowBox = true;
    return (
      <React.Fragment>
        <Router />
      </React.Fragment>
    )
  }
}

export default App