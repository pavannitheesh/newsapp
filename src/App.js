import React ,{useState}from 'react'
import {
  BrowserRouter as Router,
  Route,Routes,
} from "react-router-dom";
import './App.css';
import Navbar from './components/Navbar'
import News from './components/News'
import New2 from './components/New2'
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
          <Route excat path='/general' element={ <New2 apiKey={apiKey}setProgress={setProgress} key="general" pagesize={pageSize}  category='general'/>}></Route>
          <Route excat path='/'  element={ <New2 apiKey={apiKey}setProgress={setProgress}key="Home" pagesize={pageSize}  category='general'/>}></Route>
          <Route excat path='/business' element={ <New2 apiKey={apiKey}setProgress={setProgress} key="business"  pagesize={pageSize}  category='business'/>}></Route>
          <Route excat path='/entertainment'  element={ <New2 apiKey={apiKey}setProgress={setProgress}key="entertainment" pagesize={pageSize}  category='entertainment'/>}></Route>
          <Route excat path='/health' element={ <New2 apiKey={apiKey}setProgress={setProgress} key="health" pagesize={pageSize}  category='health'/>}></Route>
          <Route excat path='/science' element={ <New2 apiKey={apiKey}setProgress={setProgress}key="science" pagesize={pageSize}  category='science'/>}></Route>
          <Route excat path='/sports' element={ <New2 apiKey={apiKey}setProgress={setProgress}key="sports"  pagesize={pageSize}  category='sports'/>}></Route>
          <Route excat path='/technology'  element={ <New2 apiKey={apiKey}setProgress={setProgress}key="technology" pagesize={pageSize}  category='technology'/>}></Route>

        </Routes>


      </Router>


     
      
    
    )
  }


