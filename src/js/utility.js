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

function getDistance(p1, p2) {
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
  let diff = Math.abs(calcArea - rectArea);
  console.log('diff', diff);
  let precision = 1e-6;
  return diff < precision;
}
