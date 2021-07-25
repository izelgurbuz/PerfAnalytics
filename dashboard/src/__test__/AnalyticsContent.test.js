import { render, screen,fireEvent } from '@testing-library/react';
import AnalyticsContent from '../Components/AnalyticsContent';
import {AppProvider} from '../AppContainer';
describe('AnalyticsContent Tests',()=>{
  
    it('if start and end dates are not given, reset button doesnt appear ', () => {
      const  {getByText, getByTestId, container} = render(<AppProvider><AnalyticsContent open={false} /></AppProvider>);
      const content = container.querySelectorAll('.reset_button');
      expect(content.length).toBe(0);
    });
    it('if start and end dates are given, reset_button class appears ', () => {
        const  {getByText, getByTestId, container} = render(<AppProvider><AnalyticsContent open={false} /></AppProvider>);
        const target1 = container.querySelector('.start_filter input');
        fireEvent.change(target1,{target:{value:"2021/07/20 04:48 PM"}});
        const target2 = container.querySelector('.end_filter input');
        fireEvent.change(target2,{target:{value:"2021/07/20 06:48 PM"}});
        expect(container.querySelectorAll('.reset_button').length).toBe(1);
      });
});