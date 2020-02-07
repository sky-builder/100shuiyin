import React, { useState } from 'react';

import { ACTION, PAGE_STAGE } from '../js/enum';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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
  function Faq() {
    return (
      <section class="hero faq">
        <div class="hero-body">
          <div class="container">
            <h1 class="title is-1">
              FAQ
      </h1>
            <h3 class="title is-3">
              如何给图片添加水印？
      </h3>
            <p className="content">
              1. 上传本地图片<br />
              2. 使用我们的在线编辑器添加水印、编辑水印<br />
              3. 完成后，下载png或者jpeg格式图片到本地<br />
        </p>
            <h3 class="title is-3">
              我的图片安全吗？
      </h3>
            <p className="content">
              安全。图片的所有操作都直接在浏览器上执行，不会发送到服务器。
      </p>
          </div>
        </div>
      </section>
    )
  }
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
      <Router>
        <div className="app__header">
          <AppLogo />
          <AppAction {...chidlProps} />
        </div>
        <Switch>
          <Route path="/faq">
            <Faq />
          </Route>
          <Route path="/">
            <AppBody {...chidlProps} />
          </Route>
        </Switch>
      </Router>
      <div className="app__footer">
        <a href="mailto:breakthroughtgw@gmail.com">联系作者</a>
      </div>
    </div>
  );
}

export default App;
