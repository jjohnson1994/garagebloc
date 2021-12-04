export const domToSvgPoint = ({ clientX, clientY }: { clientX: number, clientY: number }, svg: SVGSVGElement) => {
  const point = svg.createSVGPoint();

  point.x = clientX;
  point.y = clientY;

  return point.matrixTransform(svg.getScreenCTM()!.inverse());
}

