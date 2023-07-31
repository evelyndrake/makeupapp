import logo from './logo.svg';
import './App.css';
import React, {useEffect} from 'react';
import { createRoot } from 'react-dom/client';
require ('dotenv').config();



const App = () => {
  var json = {
    "products": []
  }

  

  var cors = require('cors');
  var codec = require('json-url')('lzw');
  const SerpApi = require('google-search-results-nodejs');
  const key = process.env.REACT_APP_API_KEY;
  
  const inputRef = React.createRef();
  const productListRef = React.createRef();
  const searchResultsRef = React.createRef();
  let ignore = false;
  useEffect(() => {
    
    if (!ignore) {
      console.log("loading");
      productListRef.current.innerHTML = "";
      const encoded = urlParameters.get("products");
      if (encoded !== null) {
        productListRef.current.innerHTML = "";
        var decoded = codec.decompress(encoded).then(json1 => {
          console.log(json1);
          json = json1;
          for (var i = 0; i < json1["products"].length; i++) {
            productListRef.current.innerHTML += "<li><a href="+json1["products"][i]["link"]+" target='_blank'>" + json1["products"][i]["name"] + "</a></li>";
          }
        });
      }
      return () => {ignore = true;}
    }
  }, []);

  const search = () => {
    console.log(inputRef.current.value);
    const searchCurrent = new SerpApi.GoogleSearch(key);
    const params = {
      engine: "google_shopping",
      q: inputRef.current.value,
      gl: "us",
      hl: "en"
    };
    const callback = function(data) {
      for (var i = 0; i < data["shopping_results"].length; i++) {
        // searchResultsRef.current.innerHTML += "<li>" + data["shopping_results"][i]["title"];
        addResultButton(data["shopping_results"][i]["title"], data["shopping_results"][i]["link"], data["shopping_results"][i]["thumbnail"]);
        
      }
      console.log(data["shopping_results"]);
    }
    const addResult = (result, link) => {
      productListRef.current.innerHTML += "<li><a href="+link+" target='_blank'>" + result + "</a></li>";
      json["products"].push({"name": result, "link": link});
      
      var output = codec.compress(json).then(result => {
        urlParameters.set("products", result);
        window.location.search = urlParameters.toString();
        console.log(result);});
      
      

  }
    searchCurrent.json(params, callback);
    // add to search results as link
    const addResultButton = (text, link, image) => {
      var button = document.createElement("button");
      // call addResult on button click
      button.addEventListener("click", function() {
        addResult(this.innerText, link);
      });
      button.innerText = text;
      var li = document.createElement("li");
      li.appendChild(button);
      li.appendChild(document.createElement("br"));
      var imageElement = document.createElement("img");
      imageElement.src = image;
      li.appendChild(imageElement);
      searchResultsRef.current.appendChild(li);
    }
    
    // 
    // window.location.search += "&type=" + inputRef.current.value;
  }

  const urlParameters = new URLSearchParams(window.location.search);
  
  
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>Current products</p>
        <ul ref={productListRef}>

        </ul>
        
        <p>Search for a product</p>
        <input type="text" ref={inputRef} id="search" name="search" placeholder="Search.."></input>
        <button type="button" onClick={search}>Search</button>
        <ul ref={searchResultsRef}>

        </ul>
      </header>
    </div>
  );
}

// export default App;
export default App;