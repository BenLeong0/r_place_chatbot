import logo from './logo.svg';
import './App.css';

function App() {
    const socket = new WebSocket('ws://localhost:5000');

    socket.addEventListener('open', (event) => {
        console.log("Connected to server");
    });

    socket.addEventListener('message', (event) => {
        console.log("Message from server:", event.data);
    });

    const sendMessage = (message: string) => {
        socket.send(message);
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={() => {sendMessage("hi")}}>send "hi" to the server</button>
            </header>
        </div>
    );
}

export default App;
