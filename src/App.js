import React from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Home from './Components/Home/index.jsx';
import MetaMaskOnboarding from "@metamask/onboarding";
import { useWeb3React } from "@web3-react/core";

import { injected} from "./utils/connectors";
import View from './Components/Campaign/View';
import ViewRequest from './Components/Campaign/Requests';
import AddRequest from './Components/Campaign/Requests/add';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [activatingConnector, setActivatingConnector] = useState();
  const onboarding = useRef();
  const { account, activate, connector } = useWeb3React();

  useEffect(()=>{
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      setActivatingConnector(injected);
      activate(injected);
    } else {
      onboarding.current.startOnboarding();
    }
  },[])

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (account && account.length > 0) {
        onboarding.current.stopOnboarding();
      } else {
      }
    }
  }, [account]);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  return (
    <div className="App">
    <BrowserRouter>
      <Route
          path="/"
          component={Home}
          exact
        />
        <Route
          path="/view/:id"
          component={View}
          exact
        />
        <Route
          path="/view/viewrequests/:id"
          component={ViewRequest}
          exact
        />
        <Route
          path="/view/viewrequests/new/:id"
          component={AddRequest}
          exact
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
