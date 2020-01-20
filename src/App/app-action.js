import React from 'react';
import { PAGE_STAGE, ACTION, OBJECT_TYPE } from '../js/enum';
import { exportCanvas } from '../js/utility'

const AppAction = props => {
  function toWelcomeStage() {
    props.setPageStage(PAGE_STAGE.WELCOME);
    props.setLogoList([]);
    props.setActiveLogo(null);
    props.setActiveAction(ACTION.NONE);
  }
  function handleLogoChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    loadLogo(e.target.files[0])
  }
  function loadLogo(file) {
    let reader = new FileReader();
    reader.addEventListener('load', e => {
      let url = e.target.result;
      let img = new Image();
      img.src = url;
      img.addEventListener('load', () => {
        addLogo(img);
        let canvas = document.querySelector('.app__bg');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      });
    });
    reader.readAsDataURL(file);
  }
  function addLogo(img) {
    let obj = getImageObject(img);
    props.setLogoList(
      props.logoList.concat([
        obj
      ])
    );
  }
  function addText() {
    let obj = getTextObject();
    props.setLogoList(props.logoList.concat([obj]))
  }
  function exportImage() {
    let canvas = document.querySelector('.app__bg');
    exportCanvas(canvas, props.bgImage.name.split('.')[0]);
  }
  function getTextObject() {
    let cv = document.querySelector('.app__bg');
    let ctx = cv.getContext('2d');
    let h = 16;
    let font = `${h}px serif`
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
      cy: h / 2
    }
    return obj;
  }
  function getImageObject(img) {
    let nh = img.naturalHeight;
    let nw = img.naturalWidth;
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
    }
    return obj;
  }
  if (props.pageStage === PAGE_STAGE.EDIT) {
    return (
      <div className="app__action">
        <button className="app__delete button is-danger" onClick={toWelcomeStage}>
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
        <button className="app__export button is-success" onClick={exportImage}>
          export
        </button>
      </div>
    );
  } else {
    return null;
  }
};

export default AppAction;