import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import ReactJson from 'react-json-view';

export function JsonView({
  src = null,
  name = false,
  theme = 'rjv-default',
  style = {},
  iconStyle = 'circle',
  indentWidth = 8,
  collapsed = false,
  collapseStringsAfterLength = false,
  groupArraysAfterLength = 100,
  enableClipboard = true,
  displayObjectSize = false,
  displayDataTypes = false,
  defaultValue = null,
  sortKeys = false,
  validationMessage = 'Validation Error'
}: InferProps<typeof JsonView.propTypes>) {
  const {
    src: resolvedSrc,
    name: resolvedName,
    theme: resolvedTheme,
    style: resolvedStyle,
    iconStyle: resolvedIconStyle,
    indentWidth: resolvedIndentWidth,
    collapsed: resolvedCollapsed,
    collapseStringsAfterLength: resolvedCollapseStringsAfterLength,
    groupArraysAfterLength: resolvedGroupArraysAfterLength,
    enableClipboard: resolvedEnableClipboard,
    displayObjectSize: resolvedDisplayObjectSize,
    displayDataTypes: resolvedDisplayDataTypes,
    defaultValue: resolvedDefaultValue,
    sortKeys: resolvedSortKeys,
    validationMessage: resolvedValidationMessage
  } = {
    src,
    name,
    theme,
    style,
    iconStyle,
    indentWidth,
    collapsed,
    collapseStringsAfterLength,
    groupArraysAfterLength,
    enableClipboard,
    displayObjectSize,
    displayDataTypes,
    defaultValue,
    sortKeys,
    validationMessage
  } as any;

  return (
    <ReactJson
      src={resolvedSrc}
      name={resolvedName}
      theme={resolvedTheme}
      style={resolvedStyle}
      iconStyle={resolvedIconStyle}
      indentWidth={resolvedIndentWidth}
      collapsed={resolvedCollapsed}
      collapseStringsAfterLength={resolvedCollapseStringsAfterLength}
      groupArraysAfterLength={resolvedGroupArraysAfterLength}
      enableClipboard={resolvedEnableClipboard}
      displayObjectSize={resolvedDisplayObjectSize}
      displayDataTypes={resolvedDisplayDataTypes}
      defaultValue={resolvedDefaultValue}
      sortKeys={resolvedSortKeys}
      validationMessage={resolvedValidationMessage}
      onEdit={(e) => {}}
      onAdd={(a) => {}}
      onDelete={(d) => {}}
    />
  );
}

JsonView.propTypes = {
  type: PropTypes.oneOf(['array', 'object']),
  // see documentation at https://github.com/mac-s-g/react-json-view
  src: PropTypes.object,
  name: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  theme: PropTypes.string,
  style: PropTypes.object,
  iconStyle: PropTypes.oneOf(['circle', 'triangle', 'square']),
  indentWidth: PropTypes.number,
  collapsed: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  collapseStringsAfterLength: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  groupArraysAfterLength: PropTypes.number,
  enableClipboard: PropTypes.bool,
  displayObjectSize: PropTypes.bool,
  displayDataTypes: PropTypes.bool,
  defaultValue: PropTypes.object,
  sortKeys: PropTypes.bool,
  validationMessage: PropTypes.string
};
