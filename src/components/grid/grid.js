export const SYSTEM_SIZE = 20;

const emptyCell = () => ({asteroid: false});
export const emptyGrid = () => new Array(SYSTEM_SIZE).fill(0).map(() => new Array(SYSTEM_SIZE).fill(0).map(emptyCell));
export const deepCopyGrid = (fields) => {

  const newFields = emptyGrid();
  fields.forEach((row, i) => {
    row.forEach((cell, j) => {
      newFields[i][j] = {...cell};
    })
  })
  return newFields;
}

const getCoordsByDistance = (startingPoint, range) => {
  const x = startingPoint.x;
  const y = startingPoint.y;
  const coords = [];
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      const xWithinRange = x + i >= 0 && x + i < SYSTEM_SIZE;
      const yWithinRange = y + j >= 0 && y + j < SYSTEM_SIZE;
      const actualRange = Math.abs(i) === range || Math.abs(j) === range;
      if (xWithinRange && yWithinRange && actualRange) {
        coords.push({x: x + i, y: y + j});
      }
    }
  }
  return coords;
}

const applyEvent = grid => (event) => {
  if (event.trace === 0) {
    const coords = [...getCoordsByDistance(event.system, 2), ...getCoordsByDistance(event.system, 1)];
    coords.forEach(c => {
      const square = grid[c.y][c.x];
      if (!square.asteroid || square.prospected || square.deposit) {
        return;
      }
      square.depositExcluded = true;
    });
  }
  if (event.trace > 0) {
    const coords = getCoordsByDistance(event.system, event.trace);
    coords.forEach(c => {
      const square = grid[c.y][c.x];
      if (!square.asteroid || square.deposit || square.prospected || square.depositExcluded) {
        return;
      }
      if (square.possibleTrace) {
        square.possibleTrace = [...square.possibleTrace, event.system];
      } else {
        square.possibleTrace = [event.system];
      }
    });
    if (event.trace === 2) {
      const adjacentSquares = getCoordsByDistance(event.system, 1);
      adjacentSquares.forEach(c => {
        const square = grid[c.y][c.x];
        if (!square.asteroid || square.deposit || square.prospected) {
          return;
        }
        square.depositExcluded = true;
      })
    }
  }
  const eventSquare = grid[event.system.y][event.system.x];
  eventSquare.prospected = true;
  if (event.deposit) {
    eventSquare.deposit = event.deposit;
  }
}

const applyEvents = (grid, newEvents) => {
  const sortedEvents = [...newEvents].sort((e1, e2) => e1.date.localeCompare(e2.date)), copiedGrid = grid;
  sortedEvents.forEach(applyEvent(copiedGrid));
  return copiedGrid;
}

const gridFromLayout = (layout) => {
  const grid = emptyGrid();
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      grid[i][j].asteroid = layout[i * SYSTEM_SIZE + j] === 'a';
    })
  });
  return grid;
}

export const createGrid = (layout, events, deposits) => {
  const grid = applyEvents(gridFromLayout(layout), events);
  deposits.forEach(({size, type, x, y}) => {
    grid[y][x].deposit = {type, size};
  })
  return grid;
}
