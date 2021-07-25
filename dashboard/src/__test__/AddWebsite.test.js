import { render, screen,fireEvent } from '@testing-library/react';
import { AppProvider } from '../AppContainer';
import AddWebsite from '../Components/AddWebsite';
describe('AddWebsite Tests',()=>{
  
      it('in case of wrong url , red_border class appears', () => {
        const  {getByText, getByTestId, container} = render(<AppProvider><AddWebsite /></AppProvider>);
        const target = container.querySelector('.add_url input');
        fireEvent.change(target,{target:{value:'aaa'}});
        expect(container.querySelectorAll('.red_border').length).toBe(1);
 
    });
    it('in case of proper url , red_border class doesnt appear', () => {
        const  {getByText, getByTestId, container} = render(<AppProvider><AddWebsite /></AppProvider>);
        const target = container.querySelector('.add_url input');
        fireEvent.change(target,{target:{value:'aaa.com'}});
        expect(container.querySelectorAll('.red_border').length).toBe(0);
 
    });
    it('testing delete button in search group', () => {
        const mockFunc = jest
         .fn()
         .mockImplementation(() =>
         console.log(`mocked`)
          //Promise.resolve({ entity: { success: true, data: ['hello', 'adios'] } })
        )
        const  {getByText, getByTestId, container,queryByText} = render(<AppProvider><AddWebsite setSearchData={mockFunc} /></AppProvider>);
        const target = container.querySelector('.input input');
        fireEvent.change(target,{target:{value:'bbb'}});
        expect(target.value).toBe('bbb');
        const targetButton = container.querySelector('.delete');
        fireEvent.click(targetButton);
        expect(target.value).not.toBe('bbb');
 
    });
  })