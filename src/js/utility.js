import { ACTION, OBJECT_TYPE } from './enum';

function getPoint(x, y, cx, cy, angle) {
  let diffX = cx - x;
  let diffY = cy - y;
  let dist = Math.sqrt(diffX * diffX + diffY * diffY);
  /// find angle from pivot to corner
  let ca = (Math.atan2(diffY, diffX) * 180) / Math.PI;
  /// get new angle based on old + current delta angle
  let na = (((ca + angle) % 360) * Math.PI) / 180;
  /// get new x and y and round it off to integer
  let nx = x + dist * Math.cos(na);
  let ny = y + dist * Math.sin(na);
  return [nx, ny];
}

export function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function getTriangleArea(d1, d2, d3) {
  // See https://en.wikipedia.org/wiki/Heron's_formula
  var s = (d1 + d2 + d3) / 2;
  return Math.sqrt(s * (s - d1) * (s - d2) * (s - d3));
}

export function isInsideRect(p, cx, cy, rect, angle) {
  let { x, y, w, h } = rect;
  let p1 = getPoint(cx, cy, x, y, angle);
  let p2 = getPoint(cx, cy, x + w, y, angle);
  let p3 = getPoint(cx, cy, x + w, y + h, angle);
  let p4 = getPoint(cx, cy, x, y + h, angle);
  let a1 = getTriangleArea(
    getDistance(p, p1),
    getDistance(p, p2),
    getDistance(p1, p2)
  );
  let a2 = getTriangleArea(
    getDistance(p, p1),
    getDistance(p, p4),
    getDistance(p1, p4)
  );
  let a3 = getTriangleArea(
    getDistance(p, p2),
    getDistance(p, p3),
    getDistance(p2, p3)
  );
  let a4 = getTriangleArea(
    getDistance(p, p3),
    getDistance(p, p4),
    getDistance(p3, p4)
  );

  let rectArea = w * h;
  let calcArea = a1 + a2 + a3 + a4;
  // console.log(rectArea, calcArea);
  // console.log(p, cx, cy, rect, angle);
  // console.log(p1,p2,p3,p4);

  let diff = Math.abs(calcArea - rectArea);
  let precision = 1e-6;
  return diff < precision;
}

export function exportCanvas(canvas, name, option = {
  format: 'image/png',
  quality: 1
}) {
  if (!canvas) return;
  if (!name) name = new Date().getTime();
  if (!option) option = {
    format: 'image/png'
  }
  let a = document.createElement('a');
  a.setAttribute('download', name);
  switch (option.format) {
    case 'image/jpeg':
      a.href = canvas.toDataURL('image/jpeg', option.quality);
      break;
    default: {
      a.href = canvas.toDataURL('image/png');
      break;
    }
  }
  a.click();
}

export function renderImage(file, callback) {
  let reader = new FileReader();
  let name = file.name;
  reader.addEventListener('load', e => {
    let url = e.target.result;
    let img = new Image();
    img.src = url;
    img.addEventListener('load', () => {
      callback(img, name)
    });
  });
  reader.readAsDataURL(file);
}

export function loadImg(src, name, callback) {
  let img = new Image();
  img.addEventListener('load', (e) => {
    callback(img, name);
  })
  img.src = src;
}

export function getDeg(p1, p2) {
  let rad = getRad(p1, p2);
  let deg = rad2deg(rad);
  return deg;
}
export function getRad(p1, p2) {
  let x = p1[0] - p2[0];
  let y = p2[1] - p1[1];
  return Math.atan2(y, x);
}
export function rad2deg(rad) {
  return rad * 180 / Math.PI;
}

export function drawLogoList(ctx, logoList, actionType, activeLogo, imgWidth, imgHeight) {
  for (let i = 0; i < logoList.length; i += 1) {
    ctx.save();
    ctx.globalAlpha = logoList[i].opacity || 1;
    let cx = logoList[i].x + logoList[i].w / 2;
    let cy = logoList[i].y + logoList[i].h / 2;
    ctx.translate(cx, cy);
    ctx.rotate((logoList[i].angle * Math.PI) / 180);
    ctx.translate(-cx, -cy);
    if (logoList[i].objectType === OBJECT_TYPE.IMAGE) {
      let { hasShadow, shadow } = logoList[i];
      if (hasShadow && actionType === ACTION.NONE) {
        ctx.save();
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowOffsetX = shadow.xOffset;
        ctx.shadowOffsetY = shadow.yOffset;
        ctx.drawImage(
          logoList[i].img,
          logoList[i].x,
          logoList[i].y,
          logoList[i].w,
          logoList[i].h
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          logoList[i].img,
          logoList[i].x,
          logoList[i].y,
          logoList[i].w,
          logoList[i].h
        );
      }
      if (logoList[i].isTile) {
        drawTileImage(ctx, logoList[i], imgWidth, imgHeight, {
          isDrawShadow: hasShadow && actionType === ACTION.NONE
        })
      }
    } else if (logoList[i].objectType === OBJECT_TYPE.TEXT) {
      let { text, y, h, cx, cy, fontFamily, color, hasTextBg, bgColor, hasTextOutline, strokeWidth, strokeStyle, hasShadow, shadow } = logoList[i];
      ctx.textBaseline = 'top';
      ctx.font = `${parseInt(h)}px ${fontFamily}`;
      const w = ctx.measureText(text).width;
      const x = cx - w / 2;
      logoList[i].x = x;
      logoList[i].y = cy - h / 2;
      logoList[i].w = w;

      if (hasTextBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, w, h);
      }
      let isDrawShadow = hasShadow && (logoList[i] !== activeLogo || actionType === ACTION.NONE);
      if (isDrawShadow) {
        // ctx.save();
        ctx.shadowColor = shadow.color;
        ctx.shadowBlur = shadow.blur;
        ctx.shadowOffsetX = shadow.xOffset;
        ctx.shadowOffsetY = shadow.yOffset;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, w);
        // ctx.restore();
      } else {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, w);
      }
      let isDrawOutline = hasTextOutline && strokeWidth >= 1
      if (isDrawOutline) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(text, x, y, w);
      }
      if (logoList[i].isTile) {
        drawTileText(ctx, logoList[i], imgWidth, imgHeight, {
          isDrawShadow,
          isDrawOutline,
          hasTextBg
        });
      }
    }
    ctx.restore();
  }
}
function drawTileImage(ctx, logo, imageWidth, imageHeight, option = {}) {
  let { img, w, h, x, y, tileGap, shadow } = logo;
  let { isDrawShadow } = option;
  let leftCount = Math.ceil(x / (w + tileGap));
  let rightCount = Math.ceil((imageWidth - x - w) / (w + tileGap));
  let topCount = Math.ceil(y / (h + tileGap));
  let bottomCount = Math.ceil((imageHeight - y - h) / (h + tileGap));
  ctx.save();
  if (isDrawShadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.xOffset;
    ctx.shadowOffsetY = shadow.yOffset;
  }
  function draw(x, y) {
    ctx.drawImage(
      img,
      x,
      y,
      w,
      h
    );
  }
  for (let i = 0; i < topCount; i += 1) {
    for (let j = 0; j <= leftCount; j += 1) {
      let nx = x - (j * (w + tileGap));
      let ny = y - ((i + 1) * (h + tileGap));
      draw(nx, ny);
    }
    for (let j = 0; j < rightCount; j += 1) {
      let nx = x + ((j + 1) * (w + tileGap));
      let ny = y - ((i + 1) * (h + tileGap));
      draw(nx, ny);
    }
  }
  for (let i = 0; i <= bottomCount; i += 1) {
    for (let j = 0; j <= leftCount; j += 1) {
      if (i === 0 && j === 0) continue;
      let nx = x - (j * (w + tileGap));
      let ny = y + (i * (h + tileGap));
      draw(nx, ny);
    }
    for (let j = 0; j < rightCount; j += 1) {
      let nx = x + ((j + 1) * (w + tileGap));
      let ny = y + (i * (h + tileGap));
      draw(nx, ny);
    }
  }
  ctx.restore();
}
function drawTileText(ctx, logo, imageWidth, imageHeight, option = {}) {
  let { w, h, x, y, color, bgColor, text, tileGap, shadow, strokeStyle, strokeWidth } = logo;
  let leftCount = Math.ceil(x / (w + tileGap));
  let rightCount = Math.ceil((imageWidth - x - w) / (w + tileGap));
  let topCount = Math.ceil(y / (h + tileGap));
  let bottomCount = Math.ceil((imageHeight - y - h) / (h + tileGap));
  let { isDrawShadow, isDrawOutline, hasTextBg } = option;
  ctx.save();
  if (isDrawShadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.xOffset;
    ctx.shadowOffsetY = shadow.yOffset;
  }
  if (isDrawOutline) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = strokeWidth;
  }
  function draw(x, y) {
    if (hasTextBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(x, y, w, h);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, w);
    if (isDrawOutline) {
      ctx.strokeText(text, x, y, w);
    }
  }
  for (let i = 0; i < topCount; i += 1) {
    for (let j = 0; j <= leftCount; j += 1) {
      let nx = x - (j * (w + tileGap));
      let ny = y - ((i + 1) * (h + tileGap));
      draw(nx, ny);
    }
    for (let j = 0; j < rightCount; j += 1) {
      let nx = x + ((j + 1) * (w + tileGap));
      let ny = y - ((i + 1) * (h + tileGap));
      draw(nx, ny);
    }
  }
  for (let i = 0; i <= bottomCount; i += 1) {
    for (let j = 0; j <= leftCount; j += 1) {
      if (i === 0 && j === 0) continue;
      let nx = x - (j * (w + tileGap));
      let ny = y + (i * (h + tileGap));
      draw(nx, ny);
    }
    for (let j = 0; j < rightCount; j += 1) {
      let nx = x + ((j + 1) * (w + tileGap));
      let ny = y + (i * (h + tileGap));
      draw(nx, ny);
    }
  }
  ctx.restore();
}