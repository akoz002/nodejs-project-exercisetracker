'use strict';

/*
 * Renders React components with mock data for testing and styling.
 */

import {
  JSONKeyValue, JSONObjectCodeBlock, JSONArrayCodeBlock
} from '../components/jsonDisplays.js';

/*
 * A single JSONKeyValue list item.
 */

ReactDOM.render(
  <JSONKeyValue
    attr="username" value="Bob" index={1} length={1}
  />,
  document.querySelector('#JSONKeyValue')
);

/*
 * JSONObjectCodeBlock representing an object.
 */

ReactDOM.render(
  <JSONObjectCodeBlock object={{
    username: 'Alex',
    _id: '5f8e713717d4781a685549f5',
    description: 'Implementing and testing React Mockups',
    duration: 130,
    date: "Tue Aug 25 2069"
  }} />,
  document.querySelector('#JSONObjectCodeBlock')
);

/*
 * JSONArrayCodeBlock representing a stand-alone array.
 */

ReactDOM.render(
  <JSONArrayCodeBlock array={[
    { username: 'Jim', _id: '5f8e713717d4781a685549f5' },
    { username: 'Bob', _id: 'ac3e71bc17d4d81a6e5f49f5' }
  ]} />,
  document.querySelector('#JSONArrayCodeBlock')
);

/*
 * JSONObjectCodeBlock with a nested array.
 */

ReactDOM.render(
  <JSONObjectCodeBlock object={{
    username: 'Alex',
    _id: '5f8e713717d4781a685549f5',
    log: [
      { description: 'Testing React Mockups', duration: 90, date: "Tue Aug 25 2069" },
      { description: 'Beer', duration: 60, date: "Tue Aug 13 1969" },
      { description: 'Donuts', duration: 30, date: "Tue Aug 08 3000" }
    ],
    count: 3
  }} />,
  document.querySelector('#nested-array')
);
