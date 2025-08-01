import { screen, render } from "@testing-library/react";
import TestComponent from "./TestComponent";

test('Testing the test component',()=>{
    render(<TestComponent/>);
    const element = screen.getByText(/test component/i);
    const title = screen.getByTitle(/Dummy img/i);
    expect(element).toBeInTheDocument();
    expect(title).toBeInTheDocument();
})

test("testing the input box", ()=>{
    render(<TestComponent/>);
    const inputBox = screen.getByRole('textbox');
    const inputPlaceholder = screen.getByPlaceholderText(/username/i);
    expect(inputBox).toBeInTheDocument();
    expect(inputPlaceholder).toBeInTheDocument();
    expect(inputBox).toHaveAttribute("name","username");
    expect(inputBox).toHaveAttribute("id","userId");
    expect(inputBox).toHaveAttribute("type","text");
    expect(inputBox).toHaveAttribute("value","Mukesh");
})