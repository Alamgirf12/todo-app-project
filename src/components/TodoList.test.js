import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TodoList from "../TodoList"; 

describe("TodoList Component", () => {
  it("renders without errors", () => {
    render(<TodoList />);
  });

  it("adds a new todo when the 'Add' button is clicked", () => {
    const { getByPlaceholderText, getByText } = render(<TodoList />);
    const inputElement = getByPlaceholderText("New Todo");
    const addButton = getByText("Add");

    fireEvent.change(inputElement, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    // You can assert that the new todo is added to the list
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
  });

  it("removes a todo when the 'Remove' button is clicked", () => {
    const { getByPlaceholderText, getByText, getByTestId, queryByText } = render(
      <TodoList />
    );
    const inputElement = getByPlaceholderText("New Todo");
    const addButton = getByText("Add");

    fireEvent.change(inputElement, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    const removeButton = getByTestId("remove-button-0"); // Assumes you have a 'data-testid' on your Remove button
    fireEvent.click(removeButton);

    // You can assert that the todo has been removed from the list
    expect(queryByText("Test Todo")).toBeNull();
  });

  // Add more tests for other functionalities

  it("clears completed todos when the 'Clear Completed' button is clicked", () => {
    const { getByPlaceholderText, getByText, queryByText, getByTestId } = render(
      <TodoList />
    );

    const inputElement = getByPlaceholderText("New Todo");
    const addButton = getByText("Add");

    fireEvent.change(inputElement, { target: { value: "Test Todo" } });
    fireEvent.click(addButton);

    // Mark the todo as completed
    const checkbox = getByTestId("checkbox-0"); // Assuming you have a 'data-testid' on your checkbox input
    fireEvent.click(checkbox);

    // Check that the todo is completed
    expect(checkbox).toBeChecked();

    // Click the 'Clear Completed' button
    const clearCompletedButton = getByText("Clear Completed");
    fireEvent.click(clearCompletedButton);

    // Check that the completed todo is removed
    expect(queryByText("Test Todo")).toBeNull();
  });
});
