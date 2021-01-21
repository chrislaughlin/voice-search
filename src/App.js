import {useEffect, useState} from 'react';
import './App.css';
import styled from 'styled-components';
import Mic from './mic-icon.jpg';
import { GiphyFetch } from '@giphy/js-fetch-api'
import {key} from "./api";
import Gallery from 'react-photo-gallery'

const RecordButton = styled.img`
  height: 50px;
  width: 50px;

  &.disabled {
    opacity: 0.2;
  }
`;

// eslint-disable-next-line
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const speech = new SpeechRecognition();
speech.continuous = true;

const gifAPI = new GiphyFetch(key);

function App() {

    const [recordedText, setRecordedText] = useState('');
    const [gifs, setGifs] = useState([]);
    const [isListing, setIsListing] = useState(false);

    useEffect(() => {
        speech.onresult = event => {
            setRecordedText(
                event.results[event.results.length - 1][0].transcript
            );
        }
    }, [])

    useEffect(() => {
        gifAPI.search(
            recordedText,
            {
                limit: 10,
                lang: 'es',
                type: "stickers"
            }
        ).then(response => {
            setGifs(response.data.map(gif => {
                return {
                    width: gif.images.original.width,
                    height: gif.images.original.height,
                    src: gif.images.original.url
                }
            }))
            console.log(response.data);
        });
    }, [recordedText])

    return (
        <div className="App">
            <header className="App-header">
                {
                    !isListing && (
                        <>
                            <h1>
                                Search for GIFs using your voice
                            </h1>
                            <h2>Click the mic to start</h2>
                        </>
                    )
                }
                <RecordButton
                    src={Mic}
                    alt="mic icon"
                    onClick={() => {
                        speech.start()
                        setIsListing(true);
                    }}
                    className={isListing ? 'disabled' : ''}
                />
                {
                    isListing && <h1>
                        Searching for: {recordedText}
                    </h1>
                }
                <Gallery photos={gifs} />
            </header>
        </div>
    );
}

export default App;
