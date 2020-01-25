import React from 'react';
import { PAGE_STAGE, ACTION, OBJECT_TYPE, SCALE_TYPE } from '../js/enum';
import { exportCanvas } from '../js/utility';

const AppAction = props => {
  const { bgImage, logoList } = props;
  const { name, scale } = bgImage;
  function toWelcomeStage() {
    props.setPageStage(PAGE_STAGE.WELCOME);
    props.setLogoList([]);
    props.setActiveLogo(null);
    props.setActiveAction(ACTION.NONE);
  }
  function handleLogoChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    loadLogo(e.target.files[0]);
  }
  function loadLogo(file) {
    let reader = new FileReader();
    reader.addEventListener('load', e => {
      let url = e.target.result;
      let img = new Image();
      img.src = url;
      img.addEventListener('load', () => {
        addLogo(img);
      });
    });
    reader.readAsDataURL(file);
  }
  function addLogo(img) {
    let obj = getImageObject(img);
    props.setLogoList(props.logoList.concat([obj]));
  }
  function addText() {
    let obj = getTextObject();
    props.setLogoList(props.logoList.concat([obj]));
  }
  function triggerModal() {
    let modal = document.querySelector('.modal');
    modal.classList.toggle('is-active');
  }
  function exportImage(option) {
    const { img } = bgImage;
    let bg = document.querySelector('.app__bg')
    let canvas = document.createElement('canvas');
    canvas.width = bg.width;
    canvas.height = bg.height;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0); 
    for (let i = 0; i < logoList.length; i += 1) {
      ctx.save();
      ctx.globalAlpha = logoList[i].opacity || 1;
      let cx = logoList[i].x + logoList[i].w / 2;
      let cy = logoList[i].y + logoList[i].h / 2;
      ctx.translate(cx, cy);
      ctx.rotate((logoList[i].angle * Math.PI) / 180);
      ctx.translate(-cx, -cy);
      if (logoList[i].objectType === OBJECT_TYPE.IMAGE) {
        ctx.drawImage(
          logoList[i].img,
          logoList[i].x,
          logoList[i].y,
          logoList[i].w,
          logoList[i].h
        );
      } else if (logoList[i].objectType === OBJECT_TYPE.TEXT) {
        let { text, x, y, h, w, color, bgColor, strokeStyle, strokeWidth } = logoList[i];
        ctx.textBaseline = 'top';
        ctx.font = `${h}px serif`;
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, w);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(text, x, y, w);
      }
      ctx.restore();
    }
    let nameInput = document.getElementById('js-image-name-input');
    let name = nameInput.value;
    exportCanvas(canvas, name, option);
  }
  function exportPng() {
    exportImage();
  }
  function exportJpg() {
    let el = document.getElementById('js-export-jpg-button')
    let value = +el.value;
    exportImage({
      format: 'image/jpeg',
      quality: value
    });
  }
  function getTextObject() {
    let cv = document.querySelector('.app__bg');
    let ctx = cv.getContext('2d');
    let h = 16 / scale;
    let font = `${h}px serif`;
    ctx.font = font;
    let text = 'hello,world';
    let w = ctx.measureText(text).width;
    let obj = {
      x: 0,
      y: 0,
      w: w,
      h: h,
      objectType: OBJECT_TYPE.TEXT,
      text: text,
      opacity: 1,
      angle: 0,
      cx: w / 2,
      cy: h / 2,
      id: props.logoId,
      color: '#000',
      bgColor: 'transparent',
      strokeStyle: '#000',
      strokeWidth: 2,
      hasShadow: false,
      shadow: {
        color: '#000000',
        blur: 10,
        xOffset: 5,
        yOfffset: 5,
      },
      fontFamily: 'serif'
    };
    props.setLogoId(props.logoId + 1);
    return obj;
  }
  function getImageObject(img) {
    let nh = img.naturalHeight;
    let nw = img.naturalWidth;
    nw /= scale;
    nh /= scale;
    let obj = {
      x: 0,
      y: 0,
      w: nw,
      h: nh,
      img: img,
      opacity: 1,
      angle: 0,
      objectType: OBJECT_TYPE.IMAGE,
      cx: nw / 2,
      cy: nh / 2,
      id: props.logoId,
      hasShadow: false,
      shadow: {
        color: "#000000",
        blur: 10,
        xOffset: 5,
        yOffset: 5
      }
    };
    props.setLogoId(props.logoId + 1);
    return obj;
  }
  function changeScaleType(scaleType) {
    props.setBgImage({
      ...props.bgImage,
      scaleType
    })
  }
  if (props.pageStage === PAGE_STAGE.EDIT) {
    return (
      <div className="app__action">
        <button
          className="app__fit-height button"
          onClick={() => changeScaleType(SCALE_TYPE.FIT_HEIGHT)}
        >
          fit height
        </button>
        <button
          className="app__fit-height button"
          onClick={() => changeScaleType(SCALE_TYPE.FIT_WIDTH)}
        >
          fit width
        </button>
        <button
          className="app__fit-height button"
          onClick={() => changeScaleType(SCALE_TYPE.NATURAL)}
        >
          natural
        </button>
        <button
          className="app__delete button is-danger"
          onClick={toWelcomeStage}
        >
          delete
        </button>
        <button className="app__add-text button is-info" onClick={addText}>
          add text
        </button>
        <button className="app__upload button is-info ">
          <label className="app__logo-input-label">
            upload logo
            <input
              className="app__logo-input"
              type="file"
              onChange={handleLogoChange}
            />
          </label>
        </button>
        <button className="app__export button is-success" onClick={triggerModal}>
          export
        </button>
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Export Image</p>
              <button className="delete" onClick={triggerModal} aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <div className="modal-row">
                <input defaultValue={name.split('.')[0]} type="text" className="input" id="js-image-name-input" />
              </div>
              <div className="modal-row">
                <button className="button is-success" onClick={exportPng}>PNG FORMAT</button>
              </div>
              <div className="modal-row">
                <button className="button is-success" onClick={exportJpg}>JPG FORMAT</button>
                <input className="quality-input input" id="js-export-jpg-button" type="number" defaultValue="1" step="0.1" min="0" max="1" placeholder="quality" />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default AppAction;
