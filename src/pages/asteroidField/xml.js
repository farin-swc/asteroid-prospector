import {unifyDate} from '../../utils';

const parser = new DOMParser();

export const parseString = (xmlString) => {
  return parser.parseFromString(xmlString, 'text/xml');
}

export const extractLayout = (xml) => {
  return xml.getElementsByTagName('layout')[0].textContent.replace(/\s/g, '');
}

const mergeScans = (scans) => {
  const byDate = scans.reduce((rv, x) => {
    (rv[x.date] = rv[x.date] || []).push(x);
    return rv;
  }, {});
  return Object.keys(byDate).map((date) => {
    const dateScans = byDate[date];
    const firstScan = dateScans[0];
    const result = {
      date,
      system: {
        x: firstScan.x,
        y: firstScan.y
      },
      trace: firstScan.result > 0 ? firstScan.result : 0,
      deposit: firstScan.result === -2 ? {} : undefined
    }
    if (dateScans.length > 1) {
      const otherScan = dateScans[1];
      if (otherScan.result > 0) {
        result.trace = otherScan.result;
      } else if (otherScan.result === -1 && !result.trace) {
        result.trace = 0;
      } else if (otherScan.result === -2) {
        result.deposit = {};
      }
    }
    return result;
  })
}

const attachDeposits = (events, depositsByCoords) => {
  return events.map(event => ({
    ...event,
    deposit: depositsByCoords[`(${event.system.x},${event.system.y})`]
  }));
}

function groupDepositsByCoords(xml) {
  const deposits = Array.from(xml.getElementsByTagName('deposit'))
  return deposits.reduce((rv, deposit) => {
    const x = deposit.getAttribute('x')
    const y = deposit.getAttribute('y')
    rv[`(${x},${y})`] = {
      'type': deposit.getElementsByTagName('type')[0].textContent,
      'size': Number(deposit.getElementsByTagName('size')[0].textContent)
    };
    return rv;
  }, {});
}

const attachGalacticCoords = (xml, events) => {
  //<asteroid-prospecting version="1.0" galX="-1" galY="-2">
  const root = xml.getElementsByTagName('asteroid-prospecting').item(0);
  const galX = root.getAttribute('galX');
  const galY = root.getAttribute('galY');
  return events.map(event => ({...event, galaxy: {x: galX, y: galY}}));
};

export const transformScansIntoEvents = (xml) => {
  const elementsByTagName = xml.getElementsByTagName('scan');
  const scanElements = Array.from(elementsByTagName);

  const scans = scanElements.map(scan => {
    //<scan x="6" y="3" result="-1" date="Year 22 Day 143, 15:58">No Deposit at 6, 3</scan>
    const date = unifyDate(scan.getAttribute('date'));
    const x = Number(scan.getAttribute('x'));
    const y = Number(scan.getAttribute('y'));
    const result = Number(scan.getAttribute('result'));
    return {date, x, y, result};
  });
  const events = mergeScans(scans);
  const depositsByCoords = groupDepositsByCoords(xml);
  const withGalacticCoords = attachGalacticCoords(xml, events);
  return attachDeposits(withGalacticCoords, depositsByCoords);
}

export const extractDeposits = (xml) => {
  const depositElements = xml.getElementsByTagName('deposit');
  return Array.from(depositElements).map(elem => {
    const x = Number(elem.getAttribute('x'));
    const y = Number(elem.getAttribute('y'));
    const type = elem.getElementsByTagName('type')[0].textContent;
    const size = Number(elem.getElementsByTagName('size')[0].textContent);
    return {x, y, type, size};
  })
}
