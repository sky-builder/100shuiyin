import React from 'react';
import { PAGE_STAGE, ACTION } from '../js/enum';
import { exportCanvas } from '../js/utility'

const AppAction = props => {
  function exportImage() {
    let canvas = document.querySelector('.app__bg');
    exportCanvas(canvas, props.bgImage.name.split('.')[0]);
  }
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
              opacity: 1,
              angle: 0
            }
          ])
        );
        let canvas = document.querySelector('.app__bg');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
      });
    });
    reader.readAsDataURL(file);
  }
  if (props.pageStage === PAGE_STAGE.EDIT) {
    return (
      <div className="app__action">
        <button className="app__delete button is-danger" onClick={toWelcomeStage}>
          delete
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