'use strict';
/*
 * React components for displaying JSON in code blocks.
 */

/*
 * Returns a JSON key/value list element.
 */

const JSONKeyValue = ({
  attr,
  value,
  index,
  length
}) => {
  // add double quotes for strings
  let formattedValue = typeof value === "string" ? `"${value}"` : `${value}`; // add comma if not last element

  if (index < length - 1) {
    formattedValue += ',';
  }

  return /*#__PURE__*/React.createElement("li", null, `"${attr}": ${formattedValue}`);
};
/*
 * Returns a JSON object in a code-block.
 */


const JSONObjectCodeBlock = ({
  object,
  appendComma
}) => /*#__PURE__*/React.createElement("ul", {
  className: "code-block",
  style: Object.keys(object).includes('errorMessage') ? {
    color: 'crimson'
  } : {}
}, /*#__PURE__*/React.createElement("code", null, /*#__PURE__*/React.createElement("li", null, '{'), /*#__PURE__*/React.createElement("ul", {
  className: "code-block"
}, Object.keys(object).map((key, index, array) => Array.isArray(object[key]) ? /*#__PURE__*/React.createElement(JSONArrayCodeBlock, {
  key: key,
  attr: key,
  array: object[key],
  appendComma: index < array.length - 1
}) : /*#__PURE__*/React.createElement(JSONKeyValue, {
  key: key,
  attr: key,
  value: object[key],
  index: index,
  length: array.length
}))), /*#__PURE__*/React.createElement("li", null, appendComma ? '},' : '}')));
/*
 * Returns a JSON array (of objects) in a code-block.
 */


const JSONArrayCodeBlock = ({
  attr,
  array,
  appendComma
}) => /*#__PURE__*/React.createElement("ul", {
  className: "code-block",
  style: attr ? {
    'padding-left': 0
  } : {}
}, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, attr ? `"${attr}": [` : '[')), array.map((obj, index, array) => /*#__PURE__*/React.createElement(JSONObjectCodeBlock, {
  key: index,
  object: obj,
  appendComma: index < array.length - 1
})), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("code", null, appendComma ? '],' : ']')));

export { JSONKeyValue, JSONObjectCodeBlock, JSONArrayCodeBlock };