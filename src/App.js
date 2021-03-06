import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  
  render() {
    return (
      <>
        <Router>
         
          <Switch>
            <Route />
          </Switch>
        
        </Router>
      </>
    );
  }
}

export default App;
