import React, { useState, useEffect } from 'react';
import { OBJECT_TYPE, ACTION } from '../js/enum';

function PropertyPanel(props) {
  const {
    bgImage,
    activeLogo,
    setActiveLogo,
    logoList,
    setLogoList,
    setActiveAction
  } = props;

  const [opacity, setOpacity] = useState(100);
  const [isDisabled, setIsDisabled] = useState(false);

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
      switch (logoList[i].objectType) {
        case OBJECT_TYPE.TEXT:
          let { text, x, y, h } = logoList[i];
          let font = `${h}px serif`;
          ctx.textBaseline = 'top';
          ctx.font = font;
          ctx.fillText(text, x, y);
          break;
        case OBJECT_TYPE.IMAGE:
          ctx.drawImage(
            logoList[i].img,
            logoList[i].x,
            logoList[i].y,
            logoList[i].w,
            logoList[i].h
          );
          break;
        default:
          break;
      }
      ctx.restore();
    }
  }
  function removeLogo() {
    if (!activeLogo) return;
    let { id } = activeLogo;
    let index = logoList.findIndex(item => item.id === id);
    if (index !== -1) {
      logoList.splice(index, 1);
      setLogoList(logoList);
      setActiveLogo(null);
      setActiveAction(ACTION.NONE);
    }
  }
  useEffect(() => {
    setIsDisabled(!activeLogo);
    setOpacity(activeLogo ? activeLogo.opacity * 100 : 100);
    if (activeLogo && activeLogo.objectType === OBJECT_TYPE.TEXT) {
      document.getElementById('js-text-input').value = activeLogo.text
      document.getElementById('js-font-size-input').value = activeLogo.h;
    }
  }, [activeLogo]);

  function handleTextChange(e) {
    if (!activeLogo) return;
    let text = e.target.value;
    let canvas = document.querySelector(".app__bg");
    let ctx = canvas.getContext('2d');
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.font = `${activeLogo.h}px serif`;
    let w = ctx.measureText(text).width;
    ctx.restore();
    activeLogo.text = text;
    activeLogo.w = w;
    activeLogo.cx = activeLogo.x + activeLogo.w / 2;
    props.setLogoList(props.logoList.slice());
  }
  function handleFontSizeChange(e) {
    if (!activeLogo) return;
    let value = +e.target.value;
    activeLogo.h = value;
    activeLogo.y = activeLogo.cy - value / 2;
    props.setLogoList(props.logoList.slice());
  }
  function handleColorChange(e) {
    if (!activeLogo) return;
    activeLogo.color = e.target.value;
    let index = logoList.findIndex(item => item.id === activeLogo.id);
    if (index !== -1) {
      let newLogo = Object.assign({}, activeLogo);
      setActiveLogo(newLogo);
      logoList.splice(index, 1, newLogo);
    }
  }
  return (
    <div className="app__property-panel">
      <div className="">
        <label htmlFor="js-text-input" className="">text</label>
        <input id="js-text-input" type="text" className="input" onChange={evt => handleTextChange(evt)} />
      </div>
      <div className="">
        <label htmlFor="js-font-size-input" className="">font size</label>
        <input id="js-font-size-input" type="number" min="0" step="0.5" className="input" onChange={evt => handleFontSizeChange(evt)} />
      </div>
      <div className="">
        <label htmlFor="js-font-color-input" className="">font size</label>
        <input id="js-font-color-input" type="color" className="input" onChange={evt => handleColorChange(evt)} />
      </div>
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
        onClick={removeLogo}
      >
        remove logo
      </button>
    </div>
  );
}

export default PropertyPanel;
