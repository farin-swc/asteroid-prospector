import {parseString, transformScansIntoEvents} from './xml';

const xmlExample = `<?xml version="1.0"?>
<asteroid-prospecting version="1.0" galX="-1" galY="-2">
    <deposits>
        <deposit x="3" y="6" type_code="17" deposit_uid="54:11162">
            <type>Durelium</type>
            <size>94776</size>
            <stability title="Stable" description="Deposit has more than 6 months remaining before it is lost"/>
        </deposit>
        <deposit x="4" y="7" type_code="2" deposit_uid="54:11176">
            <type>Meleenium</type>
            <size>196900</size>
            <stability title="Stable" description="Deposit has more than 6 months remaining before it is lost"/>
        </deposit>
    </deposits>
    <scanhistory>
        <scan x="0" y="5" result="-1" date="Year 22 Day 143, 9:35">No Deposit at 0, 5</scan>
        <scan x="3" y="6" result="-2" date="Year 22 Day 143, 6:32">Deposit Revealed at 3, 6</scan>
        <scan x="4" y="7" result="1" date="Year 22 Day 143, 4:04">Trace 1 Square Away from 4, 7</scan>
        <scan x="4" y="7" result="-2" date="Year 22 Day 143, 4:04">Deposit Revealed at 4, 7</scan>
        <scan x="2" y="8" result="2" date="Year 22 Day 142, 17:53">Trace 2 Squares Away from 2, 8</scan>
    </scanhistory>
</asteroid-prospecting>
`

/*
        <scan x="0" y="5" result="-1" date="Year 22 Day 143, 9:35">No Deposit at 0, 5</scan>
        <scan x="3" y="6" result="-2" date="Year 22 Day 143, 6:32">Deposit Revealed at 3, 6</scan>
        <scan x="4" y="7" result="1" date="Year 22 Day 143, 4:04">Trace 1 Square Away from 4, 7</scan>
        <scan x="4" y="7" result="-2" date="Year 22 Day 143, 4:04">Deposit Revealed at 4, 7</scan>
        <scan x="2" y="8" result="2" date="Year 22 Day 142, 17:53">Trace 2 Squares Away from 2, 8</scan>
 */
test('Scans are transformed into events correctly', () => {
  const xmlTree = parseString(xmlExample)
  const events = transformScansIntoEvents(xmlTree);
  const sorted = events.sort((e1, e2) => e1.date.localeCompare(e2.date));
  const e1 = sorted[0];
  expect(e1.date).toEqual('Y22D142 17:53')
  expect(e1.system).toEqual({x: 2, y: 8})
  expect(e1.trace).toEqual(2);
  expect(e1.deposit).not.toBeDefined()
  const e2 = sorted[1];
  expect(e2.date).toEqual('Y22D143 04:04')
  expect(e2.system).toEqual({x: 4, y: 7})
  expect(e2.trace).toEqual(1);
  expect(e2.deposit).toEqual({type: 'Meleenium', size: 196900})
  const e3 = sorted[2];
  expect(e3.date).toEqual('Y22D143 06:32');
  expect(e3.system).toEqual({x: 3, y: 6})
  expect(e3.trace).toEqual(0);
  expect(e3.deposit).toEqual({type: 'Durelium', size: 94776})
  const e4 = sorted[3];
  expect(e4.date).toEqual('Y22D143 09:35');
  expect(e4.system).toEqual({x: 0, y: 5})
  expect(e4.trace).toEqual(0);
  expect(e4.deposit).not.toBeDefined();
});
