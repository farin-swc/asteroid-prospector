import { line } from './line';

export const calculateSensors = (point, startingPoint, sensorsValue, grid) => {
  const linePoints = line(point.x, point.y, startingPoint.x, startingPoint.y);
  const nonSourceLinePoints = linePoints.slice(1)
  const asteroidsCount = nonSourceLinePoints.filter(point => grid[point.y][point.x].asteroid).length
  const range = asteroidsCount === 0 ? sensorsValue + 1 : (sensorsValue + 1)  / (2 * asteroidsCount)
  const distance = Math.ceil(
    Math.sqrt(
      Math.pow((point.x - startingPoint.x), 2) + Math.pow((point.y - startingPoint.y), 2)
    )
  )

  return Math.floor(
    range / (distance + 1)
  );
}
