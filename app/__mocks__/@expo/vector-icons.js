const React = require('react');
const { Text } = require('react-native');

function MaterialCommunityIcons(props) {
  return React.createElement(Text, props, props.name || 'icon');
}
MaterialCommunityIcons.displayName = 'MaterialCommunityIcons';

module.exports.MaterialCommunityIcons = MaterialCommunityIcons;
