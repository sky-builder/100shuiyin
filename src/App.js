import React, { useState, useEffect } from 'react';
import './App.css';

// welcome -> edit
const WELCOME_STAGE = 1;
const EDIT_STAGE = 2;

const AppLogo = React.memo(props => {
  return <img className="app__logo" src="/logo192.png" alt="logo" />;
});

const AppAction = props => {
  const { activeLogo, setActiveLogo } = props;
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
              img: img
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
  useEffect(() => {
    console.log('update on activeLogo');
    if (activeLogo && activeLogo.type === 'text') {
      let el = activeLogo.el;
    }
  }, [activeLogo, setActiveLogo]);
  el.addEventListener('mousemove', e => {
    console.log('el mousemove', activeLogo);
    if (!activeLogo) return;
      let x = e.movementX;
      let y = e.movementY;
      activeLogo.x += x;
      activeLogo.y += y;
      activeLogo.el.style.left = activeLogo.x + 'px';
      activeLogo.el.style.top = activeLogo.y + 'px';
  });
  el.addEventListener('mouseup', e => {
    console.log('el mouseup', activeLogo);
    setActiveLogo(null);
    console.log('it works')
  });
  function addText() {
    let el = document.createElement('div');
    el.textContent = 'hello,world';
    el.style.position = 'absolute';
    el.style.userSelect = 'none';
    document.body.appendChild(el);
    let canvas = document.querySelector('.app__bg');
    let rect = canvas.getBoundingClientRect();
    let textObj = {
      x: rect.x,
      y: rect.y,
      w: 0,
      h: 0,
      type: 'text',
      el: el
    };
    el.addEventListener('mousedown', e => {
      console.log('mousedown');
      setActiveLogo(textObj);
    });
    props.setLogoList(props.logoList.concat([textObj]));
    console.log('add text');
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
        <button className="app__add-text button is-info" onClick={addText}>
          add text
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
    setActiveLogo
  } = props;
  const { img, name, scale } = bgImage;

  useEffect(() => {
    function handleWindowResize() {
      let nw = img.naturalWidth;
      let nh = img.naturalHeight;
      let canvas = document.querySelector('.app__bg');
      let appBody = document.querySelector('.app__body');
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
      canvas.style.transform = 'scale(' + newScale + ')';
      appBody.style.height = appBody.offsetHeight + 'px';
      canvas.width = nw;
      canvas.height = nh;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      for (let i = 0; i < logoList.length; i += 1) {
        if (logoList[i].type === 'text') {
          logoList[i].el.style.left = logoList[i].x + 'px';
          logoList[i].el.style.top = logoList[i].y + 'px';
        } else {
          ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y);
        }
      }
    }
    console.log('update on canvas');
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [activeLogo, img, logoList, name, pageStage, setBgImage]);

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
      if (logo.type === 'text') {
        continue;
      } else if (logo.type === 'image') {
        if (
          x >= logo.x &&
          x <= logo.w + logo.x &&
          y >= logo.y &&
          y <= logo.h + logo.y
        ) {
          console.log('1')
          setActiveLogo(logo);
          return;
        }
      }
    }
  }

  function handleMouseMove(e) {
    console.log('canvas mousemove', !!activeLogo);
    if (!activeLogo) return;
    let canvas = document.querySelector('.app__bg');
    let x = activeLogo.x + e.movementX / scale;
    let y = activeLogo.y + e.movementY / scale;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    activeLogo.x = x;
    activeLogo.y = y;
    ctx.drawImage(img, 0, 0);
    for (let i = 0; i < logoList.length; i += 1) {
      if (logoList[i].type === 'text') {
        logoList[i].el.style.left = logoList[i].x + 'px';
        logoList[i].el.style.top = logoList[i].y + 'px';
      } else {
        ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y);
      }
    }
  }

  function handleMouseUp(e) {
    console.log('2');
    setActiveLogo(null);
  }

  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="app__bg"
      width="0"
      height="0"
    ></canvas>
  );
};

const AppWelcome = props => {
  function handleBgChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    let reader = new FileReader();
    let name = e.target.files[0].name;
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
    reader.readAsDataURL(e.target.files[0]);
  }
  function dev() {
    let img = new Image();
    img.src = 'https://picsum.photos/600';
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
        name: 'mark',
        scale
      });
      props.setPageStage(EDIT_STAGE);
    });
  }
  dev();
  return (
    <div className="app__welcome">
      <label htmlFor="upload-bg-image">选择背景图片</label>
      <br />
      <input id="upload-bg-image" type="file" onChange={handleBgChange} />
    </div>
  );
};

function App() {
  const [pageStage, setPageStage] = useState(WELCOME_STAGE);
  const [logoList, setLogoList] = useState([]);
  const [bgImage, setBgImage] = useState();
  const [activeLogo, setActiveLogo] = useState(null);

  let chidlProps = {
    pageStage,
    setPageStage,
    bgImage,
    setBgImage,
    logoList,
    setLogoList,
    activeLogo,
    setActiveLogo
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
