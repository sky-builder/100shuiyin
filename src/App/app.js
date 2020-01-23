import React, { useState } from 'react';

import { ACTION, PAGE_STAGE } from '../js/enum';

import AppLogo from './app-logo';
import AppAction from './app-action';
import AppBody from './app-body';

function App() {
  const [bgImage, setBgImage] = useState({});
  const [logoList, setLogoList] = useState([]);
  const [pageStage, setPageStage] = useState(PAGE_STAGE.WELCOME);
  const [activeLogo, setActiveLogo] = useState({});
  const [activeAction, setActiveAction] = useState(ACTION.NONE);
  const [logoId, setLogoId] = useState(1); 

  let chidlProps = {
    bgImage,
    setBgImage,
    logoList,
    setLogoList,
    pageStage,
    setPageStage,
    activeLogo,
    setActiveLogo,
    activeAction,
    setActiveAction,
    logoId,
    setLogoId,
  };
  return (
    <div className="app">
      <div className="app__header">
        <AppLogo />
        <AppAction {...chidlProps} />
      </div>
      <AppBody {...chidlProps} />
    </div>
  );
}

export default App;
