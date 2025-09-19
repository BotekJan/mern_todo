import { useEffect } from 'react';


function App() {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_SERVER_URL);
                const text = await response.text(); // parse text
                console.log(text);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return <div>Check the console</div>;
}

export default App;
