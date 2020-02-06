import React from 'react';
import { PAGE_STAGE, ACTION, OBJECT_TYPE, SCALE_TYPE } from '../js/enum';
import { exportCanvas, drawLogoList } from '../js/utility';

const AppAction = props => {
  const { bgImage, logoList, activeLogo } = props;
  const { name, scale, img } = bgImage;
  function toWelcomeStage() {
    props.setPageStage(PAGE_STAGE.WELCOME);
    props.setLogoList([]);
    props.setActiveLogo(null);
    props.setActiveAction(ACTION.NONE);
  }
  function handleLogoChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    loadLogo(e.target.files[0]);
    // reset file input, so that same file can be select again
    e.target.value = '';
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
    props.setActiveLogo(obj)
  }
  function addText() {
    let obj = getTextObject();
    props.setLogoList(props.logoList.concat([obj]));
    props.setActiveLogo(obj)
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
    ctx.drawImage(img, 0, 0); 
    drawLogoList(ctx, logoList, ACTION.NONE, activeLogo, bgImage.img.naturalWidth, bgImage.img.naturalHeight);
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
    let imgWidth = img.naturalWidth;
    let imgHeight = img.naturalHeight;
    let h = Math.min(imgWidth, imgHeight) * 0.1;
    let strokeWidth = 1;
    let font = `${parseInt(h)}px Times New Roman`;
    ctx.font = font;
    let text = 'hello,world';
    let w = ctx.measureText(text).width;
    let x = imgWidth * 0.5 - w * 0.5;
    let y = imgHeight * 0.5 - h * 0.5;
    let obj = {
      x: x,
      y: y,
      w: w,
      h: h,
      objectType: OBJECT_TYPE.TEXT,
      text: text,
      opacity: 1,
      angle: 0,
      cx: x + w / 2,
      cy: y + h / 2,
      id: props.logoId,
      color: '#ffffff',
      hasTextBg: false,
      bgColor: '#333333',
      hasTextOutline: false,
      strokeStyle: '#333333',
      isTile: false,
      tileGap: 100,
      strokeWidth: strokeWidth,
      hasShadow: true,
      shadow: {
        color: '#000000',
        blur: 10,
        xOffset: 5,
        yOffset: 5,
      },
      fontFamily: 'Times New Roman'
    };
    props.setLogoId(props.logoId + 1);
    return obj;
  }
  function getImageObject(img) {
    let nh = img.naturalHeight;
    let nw = img.naturalWidth;
    let imgWidth = bgImage.img.naturalWidth;
    let imgHeight = bgImage.img.naturalHeight;
    let s = nw / nh;
    nw = Math.min(imgWidth, imgHeight) * 0.25
    nh = nw / s;
    let obj = {
      x: 0,
      y: 0,
      w: nw,
      h: nh,
      img: img,
      opacity: 1,
      angle: 0,
      isTile: false,
      tileGap: 100,
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
          适配高度
        </button>
        <button
          className="app__fit-height button"
          onClick={() => changeScaleType(SCALE_TYPE.FIT_WIDTH)}
        >
          适配宽度
        </button>
        <button
          className="app__fit-height button"
          onClick={() => changeScaleType(SCALE_TYPE.NATURAL)}
        >
          原始大小
        </button>
        <button
          className="app__delete button is-danger"
          onClick={toWelcomeStage}
        >
          删除
        </button>
        <button className="app__add-text button is-info" onClick={addText}>
          添加文本水印
        </button>
        <button className="app__upload button is-info ">
          <label className="app__logo-input-label">
            添加图片水印
            <input
              className="app__logo-input"
              type="file"
              onInput={handleLogoChange}
            />
          </label>
        </button>
        <button className="app__export button is-success" onClick={triggerModal}>
          下载
        </button>
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">下载图片</p>
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
