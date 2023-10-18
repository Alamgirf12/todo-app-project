import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";

const TodoList: React.FC = () => {
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const itemsPerPage = viewMode === "card" ? 12 : 7;
  const [inputText, setInputText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Define the Todo interface
  interface Todo {
    id: string;
    text: string;
    completed: boolean;
  }

  const toggleTodo = (id: string) => {

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  // Use a boolean state to track whether localStorage has been initialized.
  const [localStorageInitialized, setLocalStorageInitialized] = useState(false);



  useEffect(() => {
    // Load todos from localStorage only once
    if (!localStorageInitialized) {
      const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
      setTodos(storedTodos);
      setLocalStorageInitialized(true); // Set the flag to true
    }
  }, [localStorageInitialized]);

  useEffect(() => {
    // Save to localStorage when todos change
    if (localStorageInitialized) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, localStorageInitialized]);

  const addTodo = () => {
    if (inputText.trim() !== "") {
      const newTodo: Todo = { id: uuidv4(), text: inputText, completed: false };
      setTodos([...todos, newTodo]);
      setInputText("");
      toast.success("Done!", { duration: 1000 });
    } else {
      toast.error("input is empty!", { duration: 2000 });
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    // Check if removing the last item on the current page
    if (updatedTodos.length % itemsPerPage === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
    if (updatedTodos.length % itemsPerPage === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const searchTodos = () => {
    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const copyTodo = (id: string) => {
    const todoToCopy = todos.find((todo) => todo.id === id);
    if (todoToCopy) {
      navigator.clipboard.writeText(todoToCopy.text);
      toast.success("Copied !", { duration: 1000 });
    }
  };

  // Pagination
  const totalItems = searchTodos().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const visibleTodos = searchTodos().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="App">
      <div>
        <Toaster />
      </div>
      <h6 className="Header">Todo List</h6>
      <div className="ViewButtons">
        <button
          className={`ViewButton ${viewMode === "card" ? "Active" : ""}`}
          onClick={() => setViewMode("card")}
        >
          Card View
        </button>
        <button
          className={`ViewButton ${viewMode === "list" ? "Active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          List View
        </button>
      </div>

      <div className="TodoForm">
        <div className="InputContainer">
          <input
            type="text"
            style={{ paddingRight: "30px" }}
            className="TodoInput"
            placeholder="New Todo"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleInputKeyPress}
          />
          {inputText && (
            <div className="ClearInputIcon" onClick={() => setInputText("")}>
              X
            </div>
          )}
        </div>
        <button className="AddButton" onClick={addTodo}>
          Add
        </button>
      </div>
      <div className="TodoForm">
        <div className="InputContainer">
          <input
            style={{ paddingRight: "30px" }}
            type="text"
            className="SearchInput"
            placeholder="Search Todos"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          {searchText && (
            <div className="ClearInputIcon" onClick={() => setSearchText("")}>
              X
            </div>
          )}
        </div>
      </div>
      {todos.length > 0 && (
        <button className="ClearButton" onClick={clearCompleted}>
          Clear Completed
        </button>
      )}

      {visibleTodos.length < 1 ? (
        <h4 style={{ textAlign: "center" }}>No item found</h4>
      ) : (
        <>
          {viewMode === "card" && (
            <div className="TodoGrid">
              {visibleTodos.map((todo) => (
                <div
                  className={`TodoCard ${todo.completed ? "Completed" : ""}`}
                  key={todo.id}
                >
                  <div className="TodoText" onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    {todo.text}
                  </div>
                  <div className="Buttons">
                    <button
                      className="RemoveButton"
                      onClick={() => removeTodo(todo.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="CopyButton"
                      onClick={() => copyTodo(todo.id)}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {viewMode === "list" && (
            <ul className="ListView">
              {visibleTodos.map((todo) => (
                <li
                  className={`ListTodo ${todo.completed ? "Completed" : ""}`}
                  key={todo.id}
                >
                  <div className="TodoText"  style ={{cursor:'pointer'}} onClick={() => toggleTodo(todo.id)}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span style={{ textAlign: "left" }}>{todo.text}</span>
                  </div>
                  <div className="Buttons">
                    <button
                      className="RemoveButton"
                      onClick={() => removeTodo(todo.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="CopyButton"
                      onClick={() => copyTodo(todo.id)}
                    >
                      Copy
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
{/* {totalPages > 1 && <> */}
      <div className="Pagination">
        <button
          className="PaginationButton"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }).map((_, page) => (
          <button
            className={`PaginationButton ${
              page + 1 === currentPage ? "ActivePage" : ""
            }`}
            key={page}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}

        <button
          className="PaginationButton"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* </>} */}
    </div>
  );
};

export default TodoList;
