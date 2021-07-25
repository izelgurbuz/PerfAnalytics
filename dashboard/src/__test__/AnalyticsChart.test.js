import { render, screen,fireEvent } from '@testing-library/react';
import AnalyticsChart from '../Components/AnalyticsChart';
import {AppProvider} from '../AppContainer';
describe('AnalyticsChart Tests',()=>{
  
    it('if no data is given, chart class doesnt appear ', () => {
      const  {getByText, getByTestId, container} = render(<AnalyticsChart />);
      const content = container.querySelectorAll('.chart');
      expect(content.length).toBe(0);
    });
    it('if no data is given, -  appears ', () => {
        const  {getByText, getByTestId, container} = render(<AnalyticsChart />);
        const label = getByText(/-/i);
        expect(label).toBeInTheDocument();
      });
      it('if data is given, chart class doesnt appear ', () => {
        const  {getByText, getByTestId, container} = render(<AnalyticsChart chartData={[['2821.400000035763','2021-07-25T13:17:35.555Z']]} />);
        const content = container.querySelectorAll('.chart');
        expect(content.length).toBe(1);
      });
});