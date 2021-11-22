import { shallow } from 'enzyme';
import React from 'react';
import { toDataFrame } from '@grafana/data';
import { AbcPanel } from './abc-panel';

/**
 * Panel
 */
describe('Panel', () => {
  it('Should find component', async () => {
    const getComponent = ({ options = { name: 'data' }, ...restProps }: any) => {
      const data = {
        series: [
          toDataFrame({
            name: 'data',
            fields: [],
          }),
        ],
      };
      return <AbcPanel data={data} {...restProps} options={options} />;
    };

    const wrapper = shallow(getComponent({ date: { series: [] } }));
    const div = wrapper.find('div');
    expect(div.exists()).toBeTruthy();
  });
});
