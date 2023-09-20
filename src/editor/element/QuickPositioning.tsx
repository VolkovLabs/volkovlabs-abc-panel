import { css } from '@emotion/css';
import React from 'react';

import { HorizontalConstraint, Placement, QuickPlacement, VerticalConstraint } from 'app/features/canvas';
import { ElementState } from 'app/features/canvas/runtime/element';

import { CanvasEditorOptions } from './elementEditor';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

type Props = {
  onPositionChange: (value: number | undefined, placement: keyof Placement) => void;
  element: ElementState;
  settings: CanvasEditorOptions;
};

export const QuickPositioning = ({ onPositionChange, element, settings }: Props) => {
  const styles = useStyles2(getStyles);

  const onQuickPositioningChange = (position: QuickPlacement) => {
    const defaultConstraint = { vertical: VerticalConstraint.Top, horizontal: HorizontalConstraint.Left };
    const originalConstraint = { ...element.options.constraint };

    element.options.constraint = defaultConstraint;
    element.setPlacementFromConstraint();

    switch (position) {
      case QuickPlacement.Top:
        onPositionChange(0, 'top');
        break;
      case QuickPlacement.Bottom:
        onPositionChange(getRightBottomPosition(element.options.placement?.height ?? 0, 'bottom'), 'top');
        break;
      case QuickPlacement.VerticalCenter:
        onPositionChange(getCenterPosition(element.options.placement?.height ?? 0, 'v'), 'top');
        break;
      case QuickPlacement.Left:
        onPositionChange(0, 'left');
        break;
      case QuickPlacement.Right:
        onPositionChange(getRightBottomPosition(element.options.placement?.width ?? 0, 'right'), 'left');
        break;
      case QuickPlacement.HorizontalCenter:
        onPositionChange(getCenterPosition(element.options.placement?.width ?? 0, 'h'), 'left');
        break;
    }

    element.options.constraint = originalConstraint;
    element.setPlacementFromConstraint();
  };

  // Basing this on scene will mean that center is based on root for the time being
  const getCenterPosition = (elementSize: number, align: 'h' | 'v') => {
    const sceneSize = align === 'h' ? settings.scene.width : settings.scene.height;

    return (sceneSize - elementSize) / 2;
  };

  const getRightBottomPosition = (elementSize: number, align: 'right' | 'bottom') => {
    const sceneSize = align === 'right' ? settings.scene.width : settings.scene.height;

    return sceneSize - elementSize;
  };

  return (
    <div className={styles.buttonGroup}>
      <button
        name="horizontal-align-left"
        onClick={() => onQuickPositioningChange(QuickPlacement.Left)}
        className={styles.button}
      />
      <button
        name="horizontal-align-center"
        onClick={() => onQuickPositioningChange(QuickPlacement.HorizontalCenter)}
        className={styles.button}
      />
      <button
        name="horizontal-align-right"
        onClick={() => onQuickPositioningChange(QuickPlacement.Right)}
        className={styles.button}
      />
      <button name="vertical-align-top" onClick={() => onQuickPositioningChange(QuickPlacement.Top)} />
      <button
        name="vertical-align-center"
        onClick={() => onQuickPositioningChange(QuickPlacement.VerticalCenter)}
        className={styles.button}
      />
      <button
        name="vertical-align-bottom"
        onClick={() => onQuickPositioningChange(QuickPlacement.Bottom)}
        className={styles.button}
      />
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  buttonGroup: css`
    display: flex;
    flex-wrap: wrap;
    padding: 12px 0 12px 0;
  `,
  button: css`
    margin-left: 5px;
    margin-right: 5px;
  `,
});
