import { useRef, useState } from "react";

function MyComponent() {
    const [todos, setTodos] = useState<string[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        if (inputRef.current && inputRef.current.value !== "") {
            setTodos([...todos, inputRef.current.value]);
            inputRef.current.value = "";
        }
    };

    const removeTodo = (index: number) => {
        setTodos(todos.filter((_, i) => i !== index));
    };

    const saveEdit = () => {
        if (editingIndex !== null) {
            const updated = [...todos];
            updated[editingIndex] = editingValue;
            setTodos(updated);
            setEditingIndex(null);
            setEditingValue("");
        }
    };

    return (
        <div className="text-center ">
            <div className="pb-[40px]">

                <h1 className="pb-[20px]">TO-DO list</h1>
                <input type="text" ref={inputRef} />
                <button onClick={handleClick}>Add Todo</button>
            </div>


            <h3>TODOs:</h3>
            {todos.map((todo, index) => (
                <div key={index} className="flex text-center justify-center align-center items-center gap-[20px] mb-[20px]">
                    {editingIndex === index ? (
                        <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={saveEdit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit();
                            }}
                            autoFocus
                        />
                    ) : (
                        <div onClick={() => {
                            setEditingIndex(index);
                            setEditingValue(todo);
                        }}>
                            {todo}
                        </div>
                    )}
                    <button className="secondary" onClick={() => removeTodo(index)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default MyComponent;
