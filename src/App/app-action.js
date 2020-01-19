import React from 'react';
import { PAGE_STAGE, ACTION } from '../js/enum';
import { exportCanvas } from '../js/utility'

const AppAction = props => {
  function exportImage() {
    drawText();
    let canvas = document.querySelector('.app__bg');
    exportCanvas(canvas, props.bgImage.name.split('.')[0]);
  }
  function drawText() {
    let canvas = document.querySelector(".app__bg");
    let ctx = canvas.getContext('2d');
    let textList = document.querySelectorAll('.app__text-logo');
    let { offsetLeft, offsetTop } = canvas;
    textList = Array.from(textList);
    textList.forEach(item => {
      let r = item.getBoundingClientRect();
      let s = window.getComputedStyle(item);
      let fs = parseInt(s.fontSize);
      fs /= props.bgImage.scale;
      console.log(props.bgImage.scale, item.offsetTop);
      console.log(fs);
      ctx.font = `16px -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif` 
      ctx.textBaseline = 'top';
      console.log(item.offsetLeft - offsetLeft, item.offsetTop - offsetTop);     
      ctx.fillText(item.innerText, item.offsetLeft - offsetLeft , item.offsetTop - offsetTop);
      let m = ctx.measureText('M').width;
      console.log(m);
    })
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
  function addText() {
    let canvas = document.querySelector('canvas');
    let x = canvas.offsetLeft;
    let y = canvas.offsetTop;
    console.log(x, y);
    let div = document.createElement('div')
    div.setAttribute('contenteditable', true);
    div.classList.add('app__text-logo')
    div.innerText = 'hello,world';
    div.style.position = 'absolute';
    div.style.display = 'inline-block';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.style.lineHeight = 1;
    let main = document.querySelector('.app__main');
    main.appendChild(div);
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
        let cx = nw / 2;
        let cy = nh / 2;
        props.setLogoList(
          props.logoList.concat([
            {
              x: 0,
              y: 0,
              w: nw,
              h: nh,
              img: img,
              opacity: 1,
              angle: 0,
              cx,
              cy
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