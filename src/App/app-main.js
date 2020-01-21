import React, { useEffect, useCallback } from 'react';

import { isInsideRect, getDistance, getDeg } from '../js/utility';
import { ACTION, OBJECT_TYPE, OUTLINE_STYLE } from '../js/enum';

const AppMain = props => {
  const {
    logoList,
    bgImage,
    setBgImage,
    activeLogo,
    setActiveLogo,
    activeAction,
    setActiveAction
  } = props;
  const { img, name, scale } = bgImage;
  const ANCHOR_WIDTH = 10;
  const ANCHOR_HEIGHT = 10;
  const drawOutline = useCallback(
    ctx => {
      if (!activeLogo) return;
      const anchorList = getAnchorList(activeLogo);
      ctx.fillStyle = OUTLINE_STYLE.FILL;
      ctx.strokeStyle = OUTLINE_STYLE.STROKE;
      ctx.strokeWidth = OUTLINE_STYLE.WIDTH;
      let { x, y, w, h } = activeLogo;
      ctx.strokeRect(x, y, w, h);
      anchorList.forEach(anchor => {
        let { x, y, w, h } = anchor;
        ctx.fillRect(x, y, w, h);
      });
    },
    [activeLogo]
  );
  const draw = useCallback(() => {
    let canvas = document.querySelector('.app__bg');
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
        let { text, x, y, h, w } = logoList[i];
        ctx.textBaseline = 'top';
        ctx.font = `${h}px serif`;
        ctx.fillText(text, x, y, w);
      }
      if (activeLogo === logoList[i]) {
        drawOutline(ctx);
      }
      ctx.restore();
    }
  }, [activeLogo, drawOutline, img, logoList]);
  useEffect(() => {
    function handleWindowResize() {
      let nw = img.naturalWidth;
      let nh = img.naturalHeight;
      let canvas = document.querySelector('.app__bg');
      let appBody = document.querySelector('.app__main');
      let bw = appBody.offsetWidth;
      let bh = appBody.offsetHeight;
      let s1 = bw / nw;
      let s2 = bh / nh;
      let newScale = Math.min(s1, s2);
      if (newScale > 1) newScale = 1;
      setBgImage({
        img: img,
        name: name,
        scale: newScale
      });
      canvas.width = nw;
      canvas.height = nh;
      if (newScale < 1) {
        canvas.style.width = nw * newScale + 'px';
        canvas.style.height = nh * newScale + 'px';
      }
      draw();
    }
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [img, name, setBgImage, logoList, draw]);
  function getAnchorList(rect) {
    let { x, y, w, h } = rect;
    let leftX = x - ANCHOR_WIDTH / 2;
    let centerX = x + w / 2 - ANCHOR_WIDTH / 2;
    let rightX = x + w - ANCHOR_WIDTH / 2;
    let topY = y - ANCHOR_HEIGHT / 2;
    let centerY = y + h / 2 - ANCHOR_HEIGHT / 2;
    let bottomY = y + h - ANCHOR_HEIGHT / 2;
    let anchorList = [
      {
        x: leftX,
        y: topY,
        type: ACTION.TOP_LEFT_RESIZE
      },
      {
        x: centerX,
        y: topY,
        type: ACTION.TOP_CENTER_RESIZE
      },
      {
        x: rightX,
        y: topY,
        type: ACTION.TOP_RIGHT_RESIZE
      },
      {
        x: leftX,
        y: centerY,
        type: ACTION.CENTER_LEFT_RESIZE
      },
      {
        x: rightX,
        y: centerY,
        type: ACTION.CENTER_RIGHT_RESIZE
      },
      {
        x: leftX,
        y: bottomY,
        type: ACTION.BOTTOM_LEFT_RESIZE
      },
      {
        x: centerX,
        y: bottomY,
        type: ACTION.BOTTOM_CENTER_RESIZE
      },
      {
        x: rightX,
        y: bottomY,
        type: ACTION.BOTTOM_RIGHT_RESIZE
      },
      {
        x: centerX,
        y: topY - 50,
        type: ACTION.ROTATE
      }
    ];
    anchorList.forEach(anchor => {
      anchor.w = ANCHOR_WIDTH;
      anchor.h = ANCHOR_HEIGHT;
    });
    return anchorList;
  }
  function getActionType(mx, my) {
    if (!activeLogo) return;
    let rectList = getAnchorList(activeLogo);
    let rect = Object.assign({}, activeLogo, { type: ACTION.MOVE });
    rectList.push(rect);
    rectList.push(activeLogo);
    for (let i = 0; i < rectList.length; i += 1) {
      let { cx, cy, angle } = activeLogo;
      if (isInsideRect([mx, my], cx, cy, rectList[i], angle)) {
        return rectList[i].type;
      }
    }
    return ACTION.NONE;
  }
  function getPos(e) {
    let canvas = document.querySelector('.app__bg');
    let x = (e.pageX - canvas.getBoundingClientRect().x) / scale;
    let y =
      (e.pageY -
        document.documentElement.scrollTop -
        canvas.getBoundingClientRect().y) /
      scale;
    return [x, y];
  }
  function handleMouseDown(e) {
    let [x, y] = getPos(e);
    let action = getActionType(x, y);

    if (action) {
      switch (action) {
        case ACTION.TOP_LEFT_RESIZE: {
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.TOP_CENTER_RESIZE: {
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.TOP_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          activeLogo.anchorY = activeLogo.y + activeLogo.h;
          break;
        }
        case ACTION.CENTER_LEFT_RESIZE: {
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          break;
        }
        case ACTION.CENTER_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          break;
        }
        case ACTION.BOTTOM_LEFT_RESIZE: {
          activeLogo.anchorX = activeLogo.x + activeLogo.w;
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.BOTTOM_CENTER_RESIZE: {
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.BOTTOM_RIGHT_RESIZE: {
          activeLogo.anchorX = activeLogo.x;
          activeLogo.anchorY = activeLogo.y;
          break;
        }
        case ACTION.MOVE: {
          break;
        }
        default: {
          break;
        }
      }
      setActiveAction(action);
      return;
    }
    for (let i = logoList.length - 1; i >= 0; i -= 1) {
      let logo = logoList[i];
      let { cx, cy, angle } = logo;
      if (isInsideRect([x, y], cx, cy, logo, angle)) {
        setActiveLogo(logo);
        setActiveAction(ACTION.MOVE);
        return;
      }
    }
  }
  function verticalResize(e) {
    let [x, y] = getPos(e);
    let { cx, cy } = activeLogo;
    let h = getDistance([x, y], [cx, cy]);
    activeLogo.y = cy - h;
    activeLogo.h = h * 2;
    if (activeLogo.objectType === OBJECT_TYPE.TEXT) {
      updateTextObjectWidth();
    }
    draw();
  }
  function updateTextObjectWidth() {
    if (!activeLogo) return;
    let {h, cx} = activeLogo;
    let canvas = document.querySelector('.app__bg');
    let ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = `${h}px serif`;
    let w =  ctx.measureText(activeLogo.text).width;
    activeLogo.w = w;
    activeLogo.x = cx - w / 2;
  }
  function horizontalResize(e) {
    let [x, y] = getPos(e);
    let { cx, cy } = activeLogo;
    let w = getDistance([x, y], [cx, cy]);
    activeLogo.x = cx - w;
    activeLogo.w = w * 2;
    draw();
  }
  function diagonalResize(e) {
    let { w, h, cx, cy } = activeLogo;
    let [x, y] = getPos(e);
    let dis = getDistance([x, y], [cx, cy]);
    // 直角三角形，已知对角线长度以及另外两边的长度比例，求另外两边长度
    let dis2 = dis * dis;
    let bottom = 1 + (w * w) / (h * h);
    let height = Math.sqrt(dis2 / bottom);
    let width = (height * w) / h;
    activeLogo.x = cx - width;
    activeLogo.y = cy - height;
    activeLogo.w = width * 2;
    activeLogo.h = height * 2;
    draw();
  }
  function move(e) {
    let x = activeLogo.x + e.movementX / scale;
    let y = activeLogo.y + e.movementY / scale;
    let cx = x + activeLogo.w / 2;
    let cy = y + activeLogo.h / 2;
    activeLogo.x = x;
    activeLogo.y = y;
    activeLogo.cx = cx;
    activeLogo.cy = cy;
    draw();
  }
  function handleMouseMove(e) {
    if (!activeLogo) return;
    if (!activeAction) return;
    switch (activeAction) {
      case ACTION.TOP_LEFT_RESIZE:
      case ACTION.TOP_RIGHT_RESIZE:
      case ACTION.BOTTOM_LEFT_RESIZE:
      case ACTION.BOTTOM_RIGHT_RESIZE: {
        diagonalResize(e);
        break;
      }
      case ACTION.CENTER_LEFT_RESIZE:
      case ACTION.CENTER_RIGHT_RESIZE: {
        horizontalResize(e);
        break;
      }
      case ACTION.TOP_CENTER_RESIZE:
      case ACTION.BOTTOM_CENTER_RESIZE: {
        verticalResize(e);
        break;
      }
      case ACTION.MOVE: {
        move(e);
        break;
      }
      case ACTION.ROTATE: {
        rotate(e);
        break;
      }
      default: {
        break;
      }
    }
  }
  function rotate(e) {
    let [mx, my] = getPos(e);
    let { x, y, w, h } = activeLogo;
    let angle = getDeg([mx, my], [x + w / 2, y + h / 2]);
    let fixedAngle = -(angle - 90);
    activeLogo.angle = fixedAngle;
    draw();
  }

  function handleMouseUp(e) {
    setActiveAction(ACTION.NONE);
  }
  return (
    <div className="app__main">
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="app__bg"
        width="0"
        height="0"
      ></canvas>
    </div>
  );
};

export default AppMain;