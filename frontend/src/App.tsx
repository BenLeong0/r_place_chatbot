import { useRef } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const ws = useRef<WebSocket>();

    const connectToSocket = () => {
        if (ws.current != null){
            ws.current.close();
        }
        ws.current = new WebSocket('ws://localhost:5000');

        ws.current.addEventListener('open', (event) => {
            console.log("Connected to server");
        });

        ws.current.addEventListener('message', (event) => {
            console.log("[Message from server]", event.data);
        });
    }

    const sendMessage = (message: string) => {
        if (ws.current != null){
            ws.current.send(message);
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <button onClick={connectToSocket}>reconnect</button>
                <button onClick={() => {sendMessage("hi")}}>send "hi" to the server</button>
            </header>
        </div>
    );
}

export default App;
