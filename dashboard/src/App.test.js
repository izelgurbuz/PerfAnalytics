import { render, screen } from '@testing-library/react';
import App from './App';
import {AppProvider} from './AppContainer'

describe('App',()=>{
  
  it('renders succesfuly', () => {
    const AppComp =  <AppProvider><App /></AppProvider>;
    expect(AppComp).toBeTruthy();
  });

  it('renders title', () => {
    const { getByText } = render(<AppProvider><App/></AppProvider>);
    const label = getByText(/PerfAnalytics/i);
    expect(label).toBeInTheDocument();
  });
  it('renders table_container class', () => {
    const {container} = render(<AppProvider><App/></AppProvider>);
    const content = container.querySelectorAll('.table_container');
    expect(content).toBeTruthy();
  });
})