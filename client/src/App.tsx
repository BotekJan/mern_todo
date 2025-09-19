import { useRef, useState } from "react";

function MyComponent() {
  const [todos, setTodos] = useState<string[]>([]); // initialize as empty array
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (inputRef.current && inputRef.current.value != "") {
      setTodos([...todos, inputRef.current.value]); // push value, not element
      inputRef.current.value = ""; // optional: clear input after adding
    }
  };

  return (
    <div>
      <input type="text" ref={inputRef} />
      <button onClick={handleClick}>Add Todo</button>

      <h3>TODOs:</h3>
      {todos.map((todo, index) => (
        <div key={index}>{todo}</div>
      ))}
    </div>
  );
}

export default MyComponent;
