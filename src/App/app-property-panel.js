import React, { useState, useEffect } from 'react';

function PropertyPanel(props) {
  const { activeLogo, bgImage, logoList } = props;
  
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
      ctx.drawImage(logoList[i].img, logoList[i].x, logoList[i].y, logoList[i].w, logoList[i].h);
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

export default PropertyPanel;