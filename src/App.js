import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
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
          <Header />
          <Switch>
            <Route />
          </Switch>
        <Footer />
        </Router>
      </>
    );
  }
}

export default App;
