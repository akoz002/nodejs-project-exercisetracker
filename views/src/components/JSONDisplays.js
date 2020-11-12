
import React from 'react';

/*
 * React components for displaying JSON in code blocks.
 */

/*
 * Returns a JSON key/value list element.
 */

export const JSONKeyValue = ({ attr, value, index, length }) => {
  // add double quotes for strings
  let formattedValue = typeof value === "string" ? `"${value}"` : `${value}`;

  // add comma if not last element
  if (index < length - 1) {
    formattedValue += ',';
  }

  return <li>{`"${attr}": ${formattedValue}`}</li>;
};

/*
 * Returns a JSON object in a code-block.
 */

export const JSONObjectCodeBlock = ({ object, appendComma }) => (
  <ul className='code-block' style={
    Object.keys(object).includes('errorMessage') ? { color: 'crimson' } : {}
  }>
    <code>
      <li>{'{'}</li>
      <ul className='code-block'>
        {Object.keys(object).map((key, index, array) =>
          Array.isArray(object[key]) ?
            <JSONArrayCodeBlock key={key} attr={key} array={object[key]}
              appendComma={index < array.length - 1} /> :
            <JSONKeyValue key={key} attr={key} value={object[key]}
              index={index} length={array.length} />
        )}
      </ul>
      <li>{appendComma ? '},' : '}'}</li>
    </code>
  </ul>
);

/*
 * Returns a JSON array (of objects) in a code-block.
 */

export const JSONArrayCodeBlock = ({ attr, array, appendComma }) => (
  <ul className='code-block' style={attr ? { 'padding-left': 0 } : {}}>
      <li><code>{attr ? `"${attr}": [` : '['}</code></li>
      {array.map((obj, index, array) =>
        <JSONObjectCodeBlock key={index} object={obj}
          appendComma={index < array.length - 1} />)}
      <li><code>{appendComma ? '],' : ']'}</code></li>
  </ul>
);
