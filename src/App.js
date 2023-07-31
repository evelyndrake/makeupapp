import logo from './logo.svg';
import './App.css';
import React, {useEffect} from 'react';
import { createRoot } from 'react-dom/client';
require ('dotenv').config();



const App = () => {
  const inputRef = React.createRef();
  const search = () => {
    console.log(inputRef.current.value);
  }


  const SerpApi = require('google-search-results-nodejs');
  const key = process.env.REACT_APP_API_KEY;
  console.log(key);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input type="text" ref={inputRef} id="search" name="search" placeholder="Search.."></input>
        <button type="button" onClick={search}>Search</button>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// export default App;
export default App;