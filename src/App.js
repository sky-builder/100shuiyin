import React, { useState, useEffect } from 'react';
import './css/base/index.css';
import './css/projects/index.css';
import './css/coesmetic/index.css';
import { isInsideRect } from './js/utility';
import { ACTION, PAGE_STAGE } from './js/enum';
import AppLogo from './App/app-logo';
import AppPropertyPanel from './App/app-property-panel';
import AppAction from './App/app-action';

const AppBody = props => {
  if (props.pageStage === PAGE_STAGE.WELCOME) {
    return (
      <div className="app__body">
        <AppWelcome {...props} />
      </div>
    );
  } else {
    return (
      <div className="app__body">
        <AppMain {...props} />
        <AppPropertyPanel {...props} />
      </div>
    );
  }
};
const AppMain = props => {
  const {
    bgImage,
    setBgImage,
    pageStage,
    logoList,
    activeLogo,
    setActiveLogo,
    activeAction,
    setActiveAction
  } = props;
  const { img, name, scale } = bgImage;

  useEffect(() => {
    function handleWindowResize() {
      let nw = img.naturalWidth;
      let nh = img.naturalHeight;
      let canvas = document.querySelector('.app__bg');
      let appBody = document.querySelector('.app__main');
      let bw = appBody.offsetWidth;
      let bh = appBody.offsetHeight;
      let s1 = bw / nw;
      let s2 = bh / nh;
      let newScale = Math.min(s1, s2);
      if (newScale > 1) newScale = 1;
      setBgImage({
        img: img,
        name: name,
        scale: newScale
      });
      canvas.width = nw;
      canvas.height = nh;
      if (newScale < 1) {
        canvas.style.width = nw * newScale + 'px';
        canvas.style.height = nh * newScale + 'px';
      }
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      for (let i = 0; i < logoList.length; i += 1) {
        ctx.save();
        ctx.globalAlpha = logoList[i].opacity;
        ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y, logoList[i].w, logoList[i].h);
        ctx.restore();
      }
    }
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [img, logoList, name, pageStage, setBgImage]);
  function getActionType(mx, my) {
    if (!activeLogo) return;
    let anchorWidth = 10;
    let anchorHeight = 10;
    let { x, y, w, h } = activeLogo;
    let leftX = x - anchorWidth / 2;
    let centerX = x + w / 2 - anchorWidth / 2;
    let rightX = x + w - anchorWidth / 2;
    let topY = y - anchorHeight / 2;
    let centerY = y + h / 2 - anchorHeight / 2;
    let bottomY = y + h - anchorHeight / 2;
    let rectList = [
      {
        x: leftX,
        y: topY,
        type: ACTION.TOP_LEFT_RESIZE
      },
      {
        x: centerX,
        y: topY,
        type: ACTION.TOP_CENTER_RESIZE
      },
      {
        x: rightX,
        y: topY,
        type: ACTION.TOP_RIGHT_RESIZE
      },
      {
        x: leftX,
        y: centerY,
        type: ACTION.CENTER_LEFT_RESIZE
      },
      {
        x: rightX,
        y: centerY,
        type: ACTION.CENTER_RIGHT_RESIZE
      },
      {
        x: leftX,
        y: bottomY,
        type: ACTION.BOTTOM_LEFT_RESIZE
      },
      {
        x: centerX,
        y: bottomY,
        type: ACTION.BOTTOM_CENTER_RESIZE,
      },
      {
        x: rightX,
        y: bottomY,
        type: ACTION.BOTTOM_RIGHT_RESIZE
      },
    ];
    for (let i = 0; i < rectList.length; i += 1) {
      rectList[i].w = anchorWidth;
      rectList[i].h = anchorHeight;
      if (isInsideRect([mx, my], bgImage.img.naturalWidth / 2, bgImage.img.naturalHeight, rectList[i], 0)) {
        return rectList[i].type
      }
    }
    return 0;
  }

  function handleMouseDown(e) {
    let canvas = document.querySelector('.app__bg');
    let x = (e.pageX - canvas.getBoundingClientRect().x) / scale;
    let y =
      (e.pageY -
        document.documentElement.scrollTop -
        canvas.getBoundingClientRect().y) /
      scale;
    let action = getActionType(x,y);
    if (action) {
      setActiveAction(action);
      switch(action) {
        case ACTION.TOP_LEFT_RESIZE: {
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.TOP_CENTER_RESIZE: {
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.TOP_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.CENTER_LEFT_RESIZE: { 
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          break;
        }
        case ACTION.CENTER_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          break;
        }
        case ACTION.BOTTOM_LEFT_RESIZE: {
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.BOTTOM_CENTER_RESIZE: {
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.BOTTOM_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.MOVE: {
          break;
        }
        default: {
          break;
        }
      }
      return;
    }
    for (let i = logoList.length - 1; i >= 0; i -= 1) {
      let logo = logoList[i];
      if (
        x >= logo.x &&
        x <= logo.w + logo.x &&
        y >= logo.y &&
        y <= logo.h + logo.y
      ) {
        setActiveLogo(logo);
        setActiveAction(ACTION.MOVE);
        return;
      }
    }
  }
  function verticalResize(e) {
    let canvas = document.querySelector('.app__bg');
    let rect = canvas.getBoundingClientRect();
    let y = (e.pageY - rect.y - document.documentElement.scrollTop) / scale;
    let dy = y - activeLogo.anchorY;
    if (dy < 0) {
      activeLogo.y = y;
      activeLogo.h = -dy;
    } else {
      activeLogo.h = dy;
      activeLogo.y = activeLogo.anchorY;
    }
    draw();
  }
  function horizontalResize(e) {
    let canvas = document.querySelector('.app__bg');
    let rect = canvas.getBoundingClientRect();
    let x = (e.pageX - rect.x) / scale;
    let dx = x - activeLogo.anchorX;
    if (dx < 0) {
      activeLogo.x = x;
      activeLogo.w  = -dx;
    } else {
      activeLogo.w = dx;
      activeLogo.x = activeLogo.anchorX;
    }
    draw();
  }
  function freeResize(e) {
    let canvas = document.querySelector('.app__bg');
    let rect = canvas.getBoundingClientRect();
    let x = (e.pageX - rect.x) / scale;
    let y = (e.pageY - rect.y - document.documentElement.scrollTop) / scale;
    let dx = x - activeLogo.anchorX;
    let dy = y - activeLogo.anchorY;
    if (dx < 0 && dy < 0) {
      activeLogo.w = -dx;
      activeLogo.h = -dy;
      activeLogo.x = x;
      activeLogo.y = y;
    } else if (dx < 0 && dy > 0) {
      activeLogo.w = -dx;
      activeLogo.h = dy;
      activeLogo.x = x;
      activeLogo.y = activeLogo.anchorY;
    } else if (dx > 0 && dy < 0) {
      activeLogo.h = -dy;
      activeLogo.w = dx;
      activeLogo.y = y;
      activeLogo.x = activeLogo.anchorX;
    } else if (dx > 0 && dy > 0) {
      activeLogo.h = dy;
      activeLogo.w = dx;
      activeLogo.x = activeLogo.anchorX;
      activeLogo.y = activeLogo.anchorY;
    }
    draw();
  }
  function move(e) {
    let x = activeLogo.x + e.movementX / scale;
    let y = activeLogo.y + e.movementY / scale;
    activeLogo.x = x;
    activeLogo.y = y;
    draw();
  }
  function draw() {
    let canvas = document.querySelector('.app__bg');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    for (let i = 0; i < logoList.length; i += 1) {
      ctx.save();
      ctx.globalAlpha = logoList[i].opacity || 1;
      ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y, logoList[i].w, logoList[i].h);
      if (activeLogo === logoList[i]) {
        drawOutline(ctx);
      }
      ctx.restore();
    }
  }
  function handleMouseMove(e) {
    if (!activeLogo) return;
    if (!activeAction) return;
    switch(activeAction) {
      case ACTION.TOP_LEFT_RESIZE:
      case ACTION.TOP_RIGHT_RESIZE:
      case ACTION.BOTTOM_LEFT_RESIZE:
      case ACTION.BOTTOM_RIGHT_RESIZE: {
        freeResize(e);
        break;
      }
      case ACTION.CENTER_LEFT_RESIZE:
      case ACTION.CENTER_RIGHT_RESIZE: {
        horizontalResize(e);
        break;
      }
      case ACTION.TOP_CENTER_RESIZE: 
      case ACTION.BOTTOM_CENTER_RESIZE: {
        verticalResize(e);
        break;
      }
      default: {
        move(e);
        break;
      }
    }
  }
  function drawOutline(ctx) {
    if (!activeLogo) return;
    let anchorWidth = 10;
    let anchorHeight = 10;
    let { x, y, w, h } = activeLogo;
    let leftX = x - anchorWidth / 2;
    let centerX = x + w / 2 - anchorWidth / 2;
    let rightX = x + w - anchorWidth / 2;
    let topY = y - anchorHeight / 2;
    let centerY = y + h / 2 - anchorHeight / 2;
    let bottomY = y + h - anchorHeight / 2;
    ctx.strokeStyle = '#399';
    ctx.strokeWidth = 2;
    ctx.fillStyle = '#688';
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(leftX, topY, anchorWidth, anchorHeight);
    ctx.fillRect(leftX, centerY, anchorWidth, anchorHeight);
    ctx.fillRect(leftX, bottomY, anchorWidth, anchorHeight);
    ctx.fillRect(centerX, topY, anchorWidth, anchorHeight);
    ctx.fillRect(centerX, bottomY, anchorWidth, anchorHeight);
    ctx.fillRect(rightX, topY, anchorWidth, anchorHeight);
    ctx.fillRect(rightX, centerY, anchorWidth, anchorHeight);
    ctx.fillRect(rightX, bottomY, anchorWidth, anchorHeight);
  }

  function handleMouseUp(e) {
    setActiveAction(ACTION.NONE);
  }

  return (
    <div className="app__main">
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="app__bg"
        width="0"
        height="0"
      ></canvas>
    </div>
  );
};

const AppWelcome = props => {
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files[0]) {
      loadBg(files[0]);
    }
  }
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleBgChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    loadBg(e.target.files[0]);
  }
  // loadbg2();
  function loadbg2() {
    let url = 'https://picsum.photos/400';
    let img = new Image();
    img.src = url;
    img.addEventListener('load', () => {
      let appBody = document.querySelector('.app__body');
      let bw = appBody.offsetWidth;
      let bh = appBody.offsetHeight;
      let s1 = bw / img.naturalWidth;
      let s2 = bh / img.naturalHeight;
      let scale = Math.min(s1, s2);
      if (scale > 1) scale = 1;
      props.setBgImage({
        img,
        name: '123',
        scale
      });
      props.setPageStage(PAGE_STAGE.EDIT);
    });
  }
  function loadBg(file) {
    let reader = new FileReader();
    let name = file.name;
    reader.addEventListener('load', e => {
      let url = e.target.result;
      let img = new Image();
      img.src = url;
      img.addEventListener('load', () => {
        let appBody = document.querySelector('.app__body');
        let bw = appBody.offsetWidth;
        let bh = appBody.offsetHeight;
        let s1 = bw / img.naturalWidth;
        let s2 = bh / img.naturalHeight;
        let scale = Math.min(s1, s2);
        if (scale > 1) scale = 1;
        props.setBgImage({
          img,
          name,
          scale
        });
        props.setPageStage(PAGE_STAGE.EDIT);
      });
    });
    reader.readAsDataURL(file);
  }
  return (
    <div
      className="app__welcome"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <label htmlFor="upload-bg-image">选择背景图片</label>
      <br />
      <input id="upload-bg-image" type="file" onChange={handleBgChange} />
    </div>
  );
};

function App() {
  const [pageStage, setPageStage] = useState(PAGE_STAGE.WELCOME);
  const [activeLogo, setActiveLogo] = useState(null);
  const [activeAction, setActiveAction] = useState(ACTION.NONE);
  const [logoList, setLogoList] = useState([]);
  const [bgImage, setBgImage] = useState();

  let chidlProps = {
    pageStage,
    setPageStage,
    bgImage,
    setBgImage,
    logoList,
    setLogoList,
    activeLogo,
    setActiveLogo,
    activeAction,
    setActiveAction
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
