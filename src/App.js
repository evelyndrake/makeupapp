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
    var params;
    if (inputRef.current.value !== "") {
    params = {
      engine: "google_shopping",
      q: inputRef.current.value,
      gl: "us",
      hl: "en"
    };} else {
      params = {
        engine: "google_shopping",
        q: "",
        gl: "us",
        hl: "en"
      };
    }
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
    var x = -1;
    var divRow = document.createElement("div");
    divRow.className = "row";
    const addResultButton = (text, link, image) => {
      var cardDiv = document.createElement("div");
      cardDiv.className = "card";
      var cardContentDiv = document.createElement("div");
      cardContentDiv.className = "card-content white-text";
      var button = document.createElement("button");
      button.className = "waves-effect pink waves-purple btn";
      // call addResult on button click
      button.addEventListener("click", function() {
        addResult(this.innerText, link);
      });
      button.innerText = text;
      
      var col = document.createElement("div");
      
      col.className = "col s12 m6 l3";
      
      cardDiv.appendChild(cardContentDiv);
      cardContentDiv.appendChild(button);
      cardContentDiv.appendChild(document.createElement("br"));
      var imageElement = document.createElement("img");
      imageElement.className = "responsive-img";
      imageElement.src = image;
      cardContentDiv.appendChild(imageElement);
      col.appendChild(cardDiv);
      divRow.appendChild(col);
      // 5 columns per row
      // if on row 5, create new row
      if (x === 10) {
        searchResultsRef.current.appendChild(divRow);
        divRow = document.createElement("div");
        divRow.className = "row";
        x = 0;

      }
      
      x++;
    }
    // for (var i = 0; i<20; i++) {
    //   addResultButton("test", "https://www.google.com", "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png");
    // }
    // 
    // window.location.search += "&type=" + inputRef.current.value;
  }

  const urlParameters = new URLSearchParams(window.location.search);
  
  
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        
        <div class="container">
        <div class = "align-center">
        <img src="https://i.imgur.com/UuI1OYQ.png" border="0"></img>
        </div>
        <p>Current products</p>
        <ul ref={productListRef}>

        </ul>
        <div class="divider pink"></div>
        <p>Search for a product</p>
        <input type="text" ref={inputRef} id="search" name="search" placeholder="Search..."></input>
        <button type="button" class = "waves-effect pink waves-purple btn" onClick={search}>Search</button>
        
        <div class="cards" ref={searchResultsRef}>

        </div>
        </div>
      </header>
    </div>
  );
}

// export default App;
export default App;