import {parseProspectingLog} from './parsers';

const longExample = `
1
Year 22 Day 144, 23:30
You gained 30 XP with the following message: Successful Training - Using a Remote

3
Y22D143 9:35
You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (0, 5). No traces were found.

4
Y22D143 6:32
You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (3, 6). You found 94,776 units of Durelium.

5
Y22D143 4:04
You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (4, 7). You found 196,900 units of Meleenium. Sensors have picked up a strong trace for an unknown deposit 1 square away.

6
Y22D142 17:53
You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (2, 8). No deposit was found. Sensors have picked up a faint trace for an unknown deposit 2 squares away.
`

test('Locations are extracted successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (0, 5). No traces were found.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.galaxy.x).toEqual(-1);
  expect(event.galaxy.y).toEqual(-2);
  expect(event.system.x).toEqual(0);
  expect(event.system.y).toEqual(5);
});

test('No traces log is parsed successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (0, 5). No traces were found.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.trace).toEqual(0);
  expect(event.deposit).not.toBeDefined();
});

test('No deposits, traces 2 away log is parsed successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (2, 8). No deposit was found. Sensors have picked up a faint trace for an unknown deposit 2 squares away.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.trace).toEqual(2);
  expect(event.deposit).not.toBeDefined();
});

test('No deposits, traces 1 away log is parsed successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (2, 7). No deposit was found. Sensors have picked up a strong trace for an unknown deposit 1 square away.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.trace).toEqual(1);
  expect(event.deposit).not.toBeDefined();
});

test('94,776 units of Durelium is parsed successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (3, 6). You found 94,776 units of Durelium.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.trace).toEqual(0);
  expect(event.deposit.type).toEqual('Durelium');
  expect(event.deposit.size).toEqual(94776);
});

test('196,900 units of Meleenium and trace 1 away is parsed successfully', () => {
  const date = 'Y22D123 10:30';
  const log = 'You have completed prospecting within the Asteroid Field foo bar (-1, -2) at (4, 7). You found 196,900 units of Meleenium. Sensors have picked up a strong trace for an unknown deposit 1 square away.';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event.trace).toEqual(1);
  expect(event.deposit.type).toEqual('Meleenium');
  expect(event.deposit.size).toEqual(196900);
});


test('Other event is rejected', () => {
  const date = 'Y22D123 10:30';
  const log = 'You gained 30 XP with the following message: Successful Training - Using a Remote';
  const event = parseProspectingLog(date + '\n' + log)[0]
  expect(event).not.toBeDefined();
});

test('Long example events are extracted correctly', () => {
  const events = parseProspectingLog(longExample);
  expect(events.length).toEqual(4);
});


