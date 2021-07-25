import { render, screen,fireEvent } from '@testing-library/react';
import WebsiteTable from '../Components/WebsiteTable';
import {AppProvider} from '../AppContainer';
const testData =[{siteId: "9dde38b9-c122-4340-8fd7-7ef794eb18bc",url: "izelgurbuz.com"}]
describe('WebsiteTable Tests',()=>{
  
    it('if table has empty data, # text_element classes is 1', () => {
       const testDataEmpty =[]
      const  {getByText, getByTestId, container} = render(<WebsiteTable data={testDataEmpty} />);
      const content = container.querySelectorAll('.text_element');
      expect(content.length).toBe(1);
    });
      it('if table has data with at least one element, # text_element classes is greater than 1', () => {
        const testData =[{siteId: "9dde38b9-c122-4340-8fd7-7ef794eb18bc",url: "izelgurbuz.com"}]
        const  {getByText, getByTestId, container} = render(<WebsiteTable data={testData} />);
        const content = container.querySelectorAll('.text_element');
        expect(content.length).toBeGreaterThan(1);
      });
      it('before expanding any row, there is no analytics_content_box ', () => {
        const  {getByText, getByTestId, container} = render(<AppProvider><WebsiteTable data={testData} /></AppProvider>);
        expect(container.querySelector('.analytics_content_box')).toBeFalsy();
      });

      it('after expanding a row, analytics_content_box appears', () => {
      const  {getByText, getByTestId, container} = render(<AppProvider><WebsiteTable data={testData} /></AppProvider>);
      const targetButton = container.querySelector('.expand_button');
      fireEvent.click(targetButton);
      expect(container.querySelector('.analytics_content_box')).toBeTruthy();
    });
 
    });