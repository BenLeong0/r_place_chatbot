import { useEffect, useRef, useState } from 'react';

import './App.css';


function App() {

    const [userId, setUserId] = useState<string>("4qs")
    const [imgUrl, setImgUrl] = useState<string>("")

    const getHash = (): string => {
        const newHash = Math.floor(99999999 * Math.random());
        return newHash.toString().padStart(8, "0");
    }

    const updateImgUrl = () => {
        const newHash = getHash()
        setImgUrl(`http://localhost:5000/${userId}#${newHash}`);
    }

    const ws = useRef<WebSocket>();

    const connectToSocket = () => {
        if (ws.current != null){
            ws.current.close();
        }
        ws.current = new WebSocket(`ws://localhost:5000/${userId}`);

        ws.current.addEventListener('open', (event) => {
            console.log("Connected to server");
        });

        ws.current.addEventListener('message', (event) => {
            console.log("[Message from server]", event.data);
            updateImgUrl();
        });
    }

    const sendMessage = (message: string) => {
        if (ws.current != null){
            ws.current.send(message);
        }
    }

    useEffect(updateImgUrl, [])

    return (
        <div className="App">
            <header className="App-header">
                <img src={imgUrl} alt="logo" />
                <input onChange={event => setUserId(event.target.value)} value={userId} />
                <button onClick={event => {updateImgUrl()}}>Update image</button>
                <button onClick={connectToSocket}>reconnect</button>
                <button onClick={() => {sendMessage("hi")}}>send "hi" to the server</button>
            </header>
        </div>
    );
}

export default App;
