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
  const hasShadow = activeLogo && activeLogo.hasShadow;

  function handleOpactiyChange(e) {
    let value = e.target.value;
    activeLogo.opacity = value / 100;
    setOpacity(value);
    updateActiveLogo();
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
    ctx.font = `${parseInt(activeLogo.h)}px ${activeLogo.fontFamily}`;
    let w = ctx.measureText(text).width;
    ctx.restore();
    activeLogo.text = text;
    activeLogo.w = w;
    activeLogo.cx = activeLogo.x + activeLogo.w / 2;
    updateActiveLogo();
  }
  function handleFontSizeChange(e) {
    if (!activeLogo) return;
    let value = +e.target.value;
    activeLogo.h = value;
    activeLogo.y = activeLogo.cy - value / 2;
    updateActiveLogo();
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
  function handleBgColorChange(e) {
    if (!activeLogo) return;
    activeLogo.bgColor = e.target.value;
    let index = logoList.findIndex(item => item.id === activeLogo.id);
    if (index !== -1) {
      let newLogo = Object.assign({}, activeLogo);
      setActiveLogo(newLogo);
      logoList.splice(index, 1, newLogo);
    }
  }
  function handleStrokeWidthChange(e) {
    if (!activeLogo) return;
    activeLogo.strokeWidth = +e.target.value;
    let index = logoList.findIndex(item => item.id === activeLogo.id);
    if (index !== -1) {
      let newLogo = Object.assign({}, activeLogo);
      setActiveLogo(newLogo);
      logoList.splice(index, 1, newLogo);
    }
  }
  function updateActiveLogo() {
    let index = logoList.findIndex(item => item.id === activeLogo.id);
    if (index !== -1) {
      let newLogo = Object.assign({}, activeLogo);
      setActiveLogo(newLogo);
      logoList.splice(index, 1, newLogo);
    }
  }
  function handleStrokeColorChange(e) {
    if (!activeLogo) return;
    activeLogo.strokeStyle = e.target.value;
    updateActiveLogo();
  }
  function toggleShadow(e) {
    activeLogo.hasShadow = e.target.checked;
    updateActiveLogo();
  }
  function handleShadowColorChange(e) {
    activeLogo.shadow.color = e.target.value;
    updateActiveLogo();
  }
  function handleShadowBlurChange(e) {
    activeLogo.shadow.blur = e.target.value;
    updateActiveLogo();
  }
  function handleShadowXoffsetChange(e) {
    activeLogo.shadow.xOffset = e.target.value;
    updateActiveLogo();
  }
  function handleShadowYoffsetChange(e) {
    activeLogo.shadow.yOffset = e.target.value;
    updateActiveLogo();
  }
  function handleFontChange(e) {
    activeLogo.fontFamily = e.target.value;
    updateActiveLogo();
  }
  const fontList = [
    {
      label: 'Times New Roman',
      value: 'Times New Roman',
    },
    {
      label: 'Zhi Mang Xing',
      value: 'Zhi Mang Xing, cursive',
    }, {
      label: 'Ma Shan Zheng',
      value: 'Ma Shan Zheng, cursive',
    }, {
      label: 'ZCOOL KuaiLe',
      value: 'ZCOOL KuaiLe, cursive'
    }, {
      label: 'ZCOOL QingKe HuangYou',
      value: 'ZCOOL QingKe HuangYou, cursive',
    }, {
      label: 'Noto Sans SC',
      value: 'Noto Sans SC, sans-serif'
    }
  ]
  if (activeLogo) {
    if (activeLogo.objectType === OBJECT_TYPE.IMAGE) {
      return (
        <div className="app__property-panel">
          <div className="app__property-group">
            <div className="input-group">
              <label htmlFor="opacity-input">透明度</label>
              <div className="input-group__body">
                <div className="row flex-75">
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
                </div>
                <div className="row flex-25 ml-10">
                  <input
                    onChange={handleOpactiyChange}
                    value={opacity}
                    id="opacity-input"
                    className="input is-small"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="app__property-group">
            <h3 className="app__property-group-title">
              <label class="checkbox">
                <input type="checkbox" onChange={toggleShadow} />
                &nbsp;阴影
          </label>
            </h3>
            {
              hasShadow ? (<div>
                <div className="">
                  <label htmlFor="js-font-stroke-color-input" className="">颜色</label>
                  <input id="js-font-stroke-color-input" type="color" className="input" defaultValue="#000000" onChange={evt => handleShadowColorChange(evt)} />
                </div>
                <div className="">
                  <label htmlFor="js-font-stroke-color-input" className="">模糊</label>
                  <input id="js-font-stroke-color-input" type="number" min="0" step="1" className="input" defaultValue="10" onChange={evt => handleShadowBlurChange(evt)} />
                </div>
                <div className="">
                  <label htmlFor="js-font-stroke-color-input" className="">水平偏移</label>
                  <input id="js-font-stroke-color-input" type="number" min="0" step="1" className="input" defaultValue="5" onChange={evt => handleShadowXoffsetChange(evt)} />
                </div>
                <div className="">
                  <label htmlFor="js-font-stroke-color-input" className="">垂直偏移</label>
                  <input id="js-font-stroke-color-input" type="number" className="input" defaultValue="5" onChange={evt => handleShadowYoffsetChange(evt)} />
                </div>
              </div>) : null
            }
          </div>
          <button
            className="app__remove-logo button is-danger"
            disabled={isDisabled}
            onClick={removeLogo}
          >
            丢弃
      </button>
        </div>
      )
    } else {
      return (
        <div className="app__property-panel">
          <div className="app__property-group">
            <div className="app__property">
              <label htmlFor="js-text-input" className="">字体</label>
              <div class="select">
                <select onChange={handleFontChange}>
                  {
                    fontList.map(font => {
                      return <option style={{ fontFamily: `${font.value}` }} value={font.value}>{font.label}</option>
                    })
                  }
                </select>
              </div>
            </div>
            <div className="app__property">
              <label htmlFor="js-text-input" className="">文本</label>
              <input id="js-text-input" type="text" className="input" defaultValue="hello,world" onChange={evt => handleTextChange(evt)} />
            </div>
            <div className="app__property">
              <label htmlFor="js-font-size-input" className="">字号</label>
              <input id="js-font-size-input" type="number" min="0" step="1" defaultValue="16" className="input" onChange={evt => handleFontSizeChange(evt)} />
            </div>
            <div className="app__property">
              <label htmlFor="js-font-color-input" className="">字体颜色</label>
              <input id="js-font-color-input" type="color" className="input" onChange={evt => handleColorChange(evt)} />
            </div>
            <div className="app__property">
              <label htmlFor="js-font-bg-color-input" className="">背景颜色</label>
              <input id="js-font-bg-color-input" type="color" className="input" onChange={evt => handleBgColorChange(evt)} />
            </div>
            <div className="input-group app__property">
              <label htmlFor="opacity-input">透明度</label>
              <div className="input-group__body">
                <div className="row flex-75">
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
                </div>
                <div className="flex-25 ml-10 row">
                  <input
                    onChange={handleOpactiyChange}
                    value={opacity}
                    id="opacity-input"
                    className="input is-small"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    disabled={isDisabled}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="app__property-group">
            <h3 className="app__property-group-title">文字边框</h3>
            <div className="app__property">
              <label htmlFor="js-font-stroke-width-input" className="">宽度</label>
              <input id="js-font-stroke-width-input" type="number" className="input" defaultValue="1" onChange={evt => handleStrokeWidthChange(evt)} />
            </div>
            <div className="app__property">
              <label htmlFor="js-font-stroke-color-input" className="">颜色</label>
              <input id="js-font-stroke-color-input" type="color" className="input" onChange={evt => handleStrokeColorChange(evt)} />
            </div>
          </div>
          <div className="app__property-group">
            <h3 className="app__property-group-title">
              <label class="checkbox">
                <input type="checkbox" onChange={toggleShadow} />
                &nbsp;阴影
          </label>
            </h3>
            {
              hasShadow ? (<div>
                <div className="app__property">
                  <label htmlFor="js-font-stroke-color-input" className="">颜色</label>
                  <input id="js-font-stroke-color-input" type="color" className="input" defaultValue="#000000" onChange={evt => handleShadowColorChange(evt)} />
                </div>
                <div className="app__property">
                  <label htmlFor="js-font-stroke-color-input" className="">模糊</label>
                  <input id="js-font-stroke-color-input" type="number" min="0" step="1" className="input" defaultValue="10" onChange={evt => handleShadowBlurChange(evt)} />
                </div>
                <div className="app__property">
                  <label htmlFor="js-font-stroke-color-input" className="">水平偏移</label>
                  <input id="js-font-stroke-color-input" type="number" min="0" step="1" className="input" defaultValue="5" onChange={evt => handleShadowXoffsetChange(evt)} />
                </div>
                <div className="app__property">
                  <label htmlFor="js-font-stroke-color-input" className="">垂直偏移</label>
                  <input id="js-font-stroke-color-input" type="number" className="input" defaultValue="5" onChange={evt => handleShadowYoffsetChange(evt)} />
                </div>
              </div>) : null
            }
          </div>

          <button
            className="app__remove-logo button is-danger"
            disabled={isDisabled}
            onClick={removeLogo}
          >
            丢弃
        </button>
        </div>
      )
    }
  } else {
    return (
      <div className="app__property-panel">
      </div>
    )
  }
}

export default PropertyPanel;
