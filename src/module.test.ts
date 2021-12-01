import { PanelPlugin } from '@grafana/data';
import { plugin } from './module';

/*
 Plugin
 */
describe('plugin', () => {
  it('Should be instance of PanelPlugin', () => {
    expect(plugin).toBeInstanceOf(PanelPlugin);
  });

  it('Should add inputs', () => {
    /**
     * Builder
     */
    const builder: any = {
      addFieldNamePicker: jest.fn().mockImplementation(() => builder),
    };

    plugin['registerOptionEditors'](builder);

    /**
     * Inputs
     */
    expect(builder.addFieldNamePicker).toHaveBeenCalled();
  });
});
