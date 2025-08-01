import {render, screen} from '@testing-library/react'
import App from './App'

test('testing for app compomemy', () => { 
  render(<App/>);
  const element = screen.getByText(/LearN React/i);
  expect(element).toBeInTheDocument();
 });

test('testing for app component', () => { 
  render(<App/>);
  const element = screen.getByText(/learn code step by step/i);
  expect(element).toBeInTheDocument();
 });