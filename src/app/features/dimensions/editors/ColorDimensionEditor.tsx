import { css } from '@emotion/css';
import React, { useCallback, useMemo } from 'react';

import { DataFrame, Field, GrafanaTheme2, SelectableValue, StandardEditorProps } from '@grafana/data';
import { ColorDimensionConfig } from '@grafana/schema';
import { ColorPicker, getFieldTypeIcon, Select, useStyles2 } from '@grafana/ui';
import { FrameFieldsDisplayNames, getFrameFieldsDisplayNames } from 'app/features/canvas/elements/metricValue';
// import { useFieldDisplayNames, useSelectOptions } from '@grafana/ui/src/components/MatchersUI/utils';

export function useFieldDisplayNames(data: DataFrame[], filter?: (field: Field) => boolean): FrameFieldsDisplayNames {
  return useMemo(() => {
    return getFrameFieldsDisplayNames(data, filter);
  }, [data, filter]);
}

export function useSelectOptions(
  displayNames: FrameFieldsDisplayNames,
  currentName?: string,
  firstItem?: SelectableValue<string>,
  fieldType?: string
): Array<SelectableValue<string>> {
  return useMemo(() => {
    let found = false;
    const options: Array<SelectableValue<string>> = [];
    if (firstItem) {
      options.push(firstItem);
    }
    for (const name of displayNames.display) {
      if (!found && name === currentName) {
        found = true;
      }
      const field = displayNames.fields.get(name);
      if (!fieldType || fieldType === field?.type) {
        options.push({
          value: name,
          label: name,
          icon: field ? getFieldTypeIcon(field) : undefined,
        });
      }
    }
    for (const name of displayNames.raw) {
      if (!displayNames.display.has(name)) {
        if (!found && name === currentName) {
          found = true;
        }
        options.push({
          value: name,
          label: `${name} (base field name)`,
        });
      }
    }

    if (currentName && !found) {
      options.push({
        value: currentName,
        label: `${currentName} (not found)`,
      });
    }
    return options;
  }, [displayNames, currentName, firstItem, fieldType]);
}

const fixedColorOption: SelectableValue<string> = {
  label: 'Fixed color',
  value: '_____fixed_____',
};

export const ColorDimensionEditor = (props: StandardEditorProps<ColorDimensionConfig>) => {
  const { value, context, onChange } = props;

  const defaultColor = 'dark-green';

  const styles = useStyles2(getStyles);
  const fieldName = value?.field;
  const isFixed = Boolean(!fieldName);
  const names = useFieldDisplayNames(context.data);
  const selectOptions = useSelectOptions(names, fieldName, fixedColorOption);

  const onSelectChange = useCallback(
    (selection: SelectableValue<string>) => {
      const field = selection.value;
      if (field && field !== fixedColorOption.value) {
        onChange({
          ...value,
          field,
        });
      } else {
        const fixed = value?.fixed ?? defaultColor;
        onChange({
          ...value,
          field: undefined,
          fixed,
        });
      }
    },
    [onChange, value]
  );

  const onColorChange = useCallback(
    (c: string) => {
      onChange({
        field: undefined,
        fixed: c ?? defaultColor,
      });
    },
    [onChange]
  );

  const selectedOption = isFixed ? fixedColorOption : selectOptions.find((v) => v.value === fieldName);
  return (
    <>
      <div className={styles.container}>
        <Select
          value={selectedOption}
          options={selectOptions}
          onChange={onSelectChange}
          noOptionsMessage="No fields found"
        />
        {isFixed && (
          <div className={styles.picker}>
            <ColorPicker color={value?.fixed ?? defaultColor} onChange={onColorChange} enableNamedColors={true} />
          </div>
        )}
      </div>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-items: center;
  `,
  picker: css`
    padding-left: 8px;
  `,
});
