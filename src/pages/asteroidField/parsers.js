import {unifyDate} from '../../utils';

const nonEmptyOrNotNumber = line => line && isNaN(line);

export const parseProspectingLog = (logString) => {
  const relevantLines = logString.split('\n')
    .filter(nonEmptyOrNotNumber);
  const events = [];
  relevantLines.forEach((line, idx) => {
    const sanitizedLine = unifyDate(line)
    if (/Y[0-9]{2}D[0-9]{1,3} [0-9]{1,2}:[0-9]{2}/.test(sanitizedLine)) {
      if (idx + 1 < relevantLines.length) {
        const event = parseEvent(sanitizedLine, relevantLines[idx + 1]);
        if (event) {
          events.push(event);
        }
      }
    }
  });
  return events;
}


const extractEventDate = (dateLine) => {
  return {
    date: dateLine,
  }
};

const parseEvent = (dateLine, detailsLine) => {
  if (!detailsLine.startsWith('You have completed prospecting within the Asteroid Field')) {
    return;
  }
  const eventDate = extractEventDate(dateLine)
  const sentences = detailsLine.split('.');
  const eventLocation = parseEventLocation(sentences[0]);
  const prospectingResults = parseProspectingResults(sentences);
  return {...eventDate, ...eventLocation, ...prospectingResults};
}

function parseEventLocation(locationString) {
  const coords = locationString.substring(locationString.indexOf('('))
    .replace(/( at )|\(|\)|,/g, ' ')
    .split(' ').filter(x => x)
  const galaxy = {
    x: Number(coords[0]),
    y: Number(coords[1])
  }
  const system = {
    x: Number(coords[2]),
    y: Number(coords[3])
  }
  return {galaxy, system};
}

function parseProspectingResults(sentences) {
  const firstTrimmed = sentences[1].trim();
  if (firstTrimmed.startsWith('No traces were found')) {
    return {trace: 0}
  }
  if (firstTrimmed.startsWith('You found')) {
    const size = Number(firstTrimmed.replace(/[^0-9]/g, ''))
    const words = firstTrimmed.split(' ');
    const type = words[words.length - 1];
    if (sentences.length > 3) {
      const trace = Number(sentences[2].replace(/[^0-9]/g, ''))
      return {trace, deposit: {size, type}}
    }
    return {trace: 0, deposit: {size, type}}
  }

  if (firstTrimmed.startsWith('No deposit was found')) {
    const trace = Number(sentences[2].replace(/[^0-9]/g, ''))
    return {trace}
  }

}


