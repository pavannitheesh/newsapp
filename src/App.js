import React ,{useState}from 'react'
import {
  BrowserRouter as Router,
  Route,Routes,
} from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar'
import News from './components/News'
import Loading from 'react-top-loading-bar'
export default function App () {
 const pageSize=5;
const  apiKey=process.env.REACT_APP_MYNEWSAPIKEY;
const [Progress, setProgress] = useState({progress:0})
  


  
    return (
    
      <Router>
        <Loading height={3} color='#f11946' progress={Progress}/>
      <Navbar/>
     
      
        <Routes>
          <Route excat path='/general' element={ <News apiKey={apiKey}setProgress={setProgress} key="general" pagesize={pageSize} country={'in'} category='general'/>}></Route>
          <Route excat path='/'  element={ <News apiKey={apiKey}setProgress={setProgress}key="Home" pagesize={pageSize} country={'in'} category='general'/>}></Route>
          <Route excat path='/business' element={ <News apiKey={apiKey}setProgress={setProgress} key="business"  pagesize={pageSize} country={'in'} category='business'/>}></Route>
          <Route excat path='/entertainment'  element={ <News apiKey={apiKey}setProgress={setProgress}key="entertainment" pagesize={pageSize} country={'in'} category='entertainment'/>}></Route>
          <Route excat path='/health' element={ <News apiKey={apiKey}setProgress={setProgress} key="health" pagesize={pageSize} country={'in'} category='health'/>}></Route>
          <Route excat path='/science' element={ <News apiKey={apiKey}setProgress={setProgress}key="science" pagesize={pageSize} country={'in'} category='science'/>}></Route>
          <Route excat path='/sports' element={ <News apiKey={apiKey}setProgress={setProgress}key="sports"  pagesize={pageSize} country={'in'} category='sports'/>}></Route>
          <Route excat path='/technology'  element={ <News apiKey={apiKey}setProgress={setProgress}key="technology" pagesize={pageSize} country={'in'} category='technology'/>}></Route>

        </Routes>


      </Router>


     
      
    
    )
  }


