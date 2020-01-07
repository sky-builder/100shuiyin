import React from 'react';
import { PAGE_STAGE } from '../js/enum';

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
  if (props.pageStage === PAGE_STAGE.EDIT) {
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

export default AppAction;