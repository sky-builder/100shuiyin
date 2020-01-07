import React, { useState, useEffect } from 'react';
import './css/base/index.css';
import './css/projects/index.css';
import './css/coesmetic/index.css';

// welcome -> edit
const WELCOME_STAGE = 1;
const EDIT_STAGE = 2;
const ACTION_NONE = 0;
const ACTION_MOVE = 1;

const AppLogo = React.memo(props => {
  return <img className="app__logo" src="/logo192.png" alt="logo" />;
});

const PropertyPanel = props => {
  const [isDisabled, setIsDisabled] = useState(false);
  const { activeLogo, bgImage, logoList } = props;
  const [opacity, setOpacity] = useState(100);
  function handleOpactiyChange(e) {
    let value = e.target.value;
    activeLogo.opacity = value / 100;
    setOpacity(value);
    let canvas = document.querySelector('.app__bg');
    let ctx = canvas.getContext('2d');
    ctx.drawImage(bgImage.img, 0, 0);
    for (let i = 0; i < logoList.length; i += 1) {
      ctx.save();
      ctx.globalAlpha = logoList[i].opacity || 1;
      ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y);
      ctx.restore();
    }
  }
  useEffect(() => {
    setIsDisabled(!activeLogo);
    setOpacity(activeLogo ? activeLogo.opacity * 100 : 100);
  }, [activeLogo]);
  return (
    <div className="app__property-panel">
      <div className="input-group">
        <label htmlFor="opacity-input">透明度</label>
        <div className="input-group__body">
          <input
            onChange={handleOpactiyChange}
            value={opacity}
            className="input-group__range"
            type="range"
            min="0"
            max="100"
            step="1"
            disabled={isDisabled}
          />
          <input
            onChange={handleOpactiyChange}
            value={opacity}
            id="opacity-input"
            className="input-group__input input is-small"
            type="number"
            min="0"
            max="100"
            step="1"
            disabled={isDisabled}
          />
        </div>
      </div>
      <button
        className="app__remove-logo button is-danger"
        disabled={isDisabled}
      >
        remove logo
      </button>
    </div>
  );
};
const AppAction = props => {
  function exportImage() {
    let canvas = document.querySelector('.app__bg');
    let a = document.createElement('a');
    a.setAttribute('download', props.bgImage.name.split('.')[0]);
    a.href = canvas.toDataURL('image/png');
    a.click();
  }
  function uploadLogo(e) {
    if (!e.target.files || !e.target.files[0]) return;
    let reader = new FileReader();
    reader.addEventListener('load', e => {
      let url = e.target.result;
      let img = new Image();
      img.src = url;
      img.addEventListener('load', () => {
        let nw = img.naturalWidth;
        let nh = img.naturalHeight;
        props.setLogoList(
          props.logoList.concat([
            {
              x: 0,
              y: 0,
              w: nw,
              h: nh,
              img: img,
              opacity: 1
            }
          ])
        );
        let canvas = document.querySelector('.app__bg');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      });
    });
    reader.readAsDataURL(e.target.files[0]);
  }
  function changeStage() {
    props.setPageStage(1);
    props.setLogoList([]);
  }
  if (props.pageStage === EDIT_STAGE) {
    return (
      <div className="app__action">
        <button className="app__delete button is-danger" onClick={changeStage}>
          delete
        </button>
        <button className="app__upload button is-info ">
          <label className="app__logo-input-label">
            upload logo
            <input
              className="app__logo-input"
              type="file"
              onChange={uploadLogo}
            />
          </label>
        </button>
        <button className="app__export button is-success" onClick={exportImage}>
          export
        </button>
      </div>
    );
  } else {
    return null;
  }
};

const AppBody = props => {
  if (props.pageStage === WELCOME_STAGE) {
    return (
      <div className="app__body">
        <AppWelcome {...props} />
      </div>
    );
  } else {
    return (
      <div className="app__body">
        <AppMain {...props} />
        <PropertyPanel {...props}></PropertyPanel>
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
        ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y);
        ctx.restore();
      }
    }
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [img, logoList, name, pageStage, setBgImage]);

  function handleMouseDown(e) {
    let canvas = document.querySelector('.app__bg');
    let x = (e.pageX - canvas.getBoundingClientRect().x) / scale;
    let y =
      (e.pageY -
        document.documentElement.scrollTop -
        canvas.getBoundingClientRect().y) /
      scale;
    for (let i = logoList.length - 1; i >= 0; i -= 1) {
      let logo = logoList[i];
      if (
        x >= logo.x &&
        x <= logo.w + logo.x &&
        y >= logo.y &&
        y <= logo.h + logo.y
      ) {
        setActiveLogo(logo);
        setActiveAction(ACTION_MOVE);
        return;
      }
    }
  }

  function handleMouseMove(e) {
    if (!activeLogo) return;
    if (!activeAction) return;
    let canvas = document.querySelector('.app__bg');
    let x = activeLogo.x + e.movementX / scale;
    let y = activeLogo.y + e.movementY / scale;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    activeLogo.x = x;
    activeLogo.y = y;
    ctx.drawImage(img, 0, 0);
    for (let i = 0; i < logoList.length; i += 1) {
      ctx.save();
      ctx.globalAlpha = logoList[i].opacity || 1;
      ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y);
      ctx.restore();
    }
  }

  function handleMouseUp(e) {
    setActiveAction(ACTION_NONE);
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
        props.setPageStage(EDIT_STAGE);
      });
    });
    reader.readAsDataURL(file);
  }
  return (
    <div className="app__welcome" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop}>
      <label htmlFor="upload-bg-image">选择背景图片</label>
      <br />
      <input id="upload-bg-image" type="file" onChange={handleBgChange} />
    </div>
  );
};

function App() {
  const [pageStage, setPageStage] = useState(WELCOME_STAGE);
  const [activeLogo, setActiveLogo] = useState(null);
  const [activeAction, setActiveAction] = useState(ACTION_NONE);
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
