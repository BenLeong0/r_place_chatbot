import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path={'/:imageId'} element={<Canvas />} />
            </Routes>
        </Router>
    );
}


const Canvas: React.FC = () => {
    const { imageId } = useParams<Readonly<{ imageId: string }>>();
    const [hash, setHash] = useState<string>("");

    const updateHash = (): void => {
        const newHashValue = Math.floor(99999999 * Math.random());
        const newHash = newHashValue.toString().padStart(8, "0");
        setHash(newHash);
    }

    const getImageUrl = () => {
        return `http://localhost:5000/${imageId}?${hash}`;
    }

    const ws = useRef<WebSocket>();

    const connectToSocket = () => {
        if (ws.current != null) {
            ws.current.close();
        }
        ws.current = new WebSocket(`ws://localhost:5000/${imageId}`);

        ws.current.addEventListener('open', (event) => {
            console.log("Connected to server");
        });

        ws.current.addEventListener('message', (event) => {
            console.log("[Message from server]", event.data);
            updateHash();
        });
    }

    useEffect(() => {
        connectToSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="image-container">
            <img
                src={getImageUrl()}
                alt={"r/place canvas for " + imageId}
            ></img>
        </div>
    )
}


export default App;
