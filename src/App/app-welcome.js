import { PAGE_STAGE, SCALE_TYPE, ACTION } from '../js/enum';
import React from 'react';

import { renderImage, loadImg } from '../js/utility';

const AppWelcome = props => {
  // necessary for enable drop event
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  // necessary for enable drop event
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer && e.dataTransfer.files;
    if (files && files[0]) {
      renderImage(files[0], loadBg);
    }
  }
  function handleBgChange(e) {
    if (!e.target.files || !e.target.files[0]) return;
    renderImage(e.target.files[0], loadBg);
  }
  // use this function to jump to stage 2 quickly
  // loadImg('https://picsum.photos/500', '123', loadBg);
  function loadBg(img, name) {
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
      scale,
      scaleType: SCALE_TYPE.FIT_HEIGHT,
      actionType: ACTION.NONE
    });
    props.setPageStage(PAGE_STAGE.EDIT);
  }
  return (
    <div
      className="app__welcome"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h1 className="title is-1">拖放图片</h1>
      <div className="file is-large">
        <label className="file-label">
          <input className="file-input" type="file" name="resume" onChange={handleBgChange} />
          <span className="file-cta">
            <span className="file-label">
              选择图片
      </span>
          </span>
        </label>
      </div>
    </div>
  );
};

export default AppWelcome;
