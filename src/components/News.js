import React, { useState, useEffect } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import Spinner from './Spinner'
import InfiniteScroll from 'react-infinite-scroll-component'
export default function News (props) {
   
  const capitalize=(str)=>{
        return str.charAt(0).toUpperCase()+str.slice(1);
    }
    const [Articles, setArticles] = useState([]);
    const [page, setpage] = useState(1);
    const [loading, setloading] = useState(false);
    const [totalResults, settotalResults] = useState(0);
  
       
        // this.state={
        //     articles:[],
        //     page:1,
        //     loading:false,
        //     country:this.props.country,
        //     totalResults:0
            

            
        // }
        

    
        useEffect(() => {
            document.title=`${capitalize(props.category)}-NewMonkey App`;
            updateNews();
                // eslint-disable-next-line 
    
     
    }, [])
    
//    async componentDidMount(){
//     this.updateNews();
       
//     }
    const updateNews=async ()=>{
        props.setProgress(0);
        let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pagesize}`;
        setloading(true);
        
        props.setProgress(30);
        let data=await fetch(url);
        let parsedData=await data.json();
        setArticles(parsedData.articles);
        settotalResults(parsedData.totalResults);
        setloading(false);
       
        props.setProgress(100);

    }
    // const handleNext=async ()=>{
       
    //      setpage(page+1);
    //      updateNews();
    // }
//    const  handlePrev= async()=>{
        // let url=`https://newsapi.org/v2/top-headlines?country=${this.state.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page-1}&pageSize=${this.props.pagesize}`;
        // this.setState({loading:true})
        // let data=await fetch(url);
        // let parsedData=await data.json();
        // this.setState({
        // page:this.state.page-1,
        // articles:parsedData.articles, loading:false


        // })

    //     setpage(page-1);
    // updateNews();

    // }
   const fetchData= async ()=>{
    const newPage=page+1;
    let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${newPage}&pageSize=${props.pagesize}`;     
       setloading(true);
        let data=await fetch(url);
        let parsedData=await data.json();
        console.log(parsedData);
        setArticles(Articles.concat(parsedData.articles));
        settotalResults(parsedData.totalResults);
        setloading(false);
        setpage(newPage);
        

    }
     
     
 
  
    
    return (
        <>
        <h1 className='text-center ' style={{marginTop:"90px"}}>News Monkey | {capitalize(props.category)} Top Headlines</h1>
        {loading && <div className='text-center'><Spinner/></div>}
        
        <InfiniteScroll
            dataLength={Articles.length} //This is important field to render the next data
            next={fetchData}
            hasMore={Articles.length !== totalResults}
            loader={<div className="text-center"><Spinner/></div>}
            // endMessage={
            //     <p style={{ textAlign: 'center' }}>
            //     <b>Yay! You have seen it all</b>
            //     </p>
            // }
            >
                <div className="container">
            <div className="row">
 
                
           { Articles.map((ele)=>{
            
                return  <div className="col-md-4" key={ele.url}>
                <NewsItem title={ele.title?ele.title.slice(0,45):""} desc={ele.description?ele.description.slice(0,150):"Click the button to read more"} newsurl={ele.url} imageurl={!ele.urlToImage?"https://cdn.arstechnica.net/wp-content/uploads/2017/12/GettyImages-837481992-760x380.jpg":ele.urlToImage} author={ele.author} date={ele.publishedAt} source={ele.source.name}/>
                 </div>
            })}
               </div>
               </div>
               
            </InfiniteScroll>
          
           
       
     
        {/* <div className="container d-flex justify-content-between">
        <button type="button" disabled={this.state.page<=1} onClick={this.handlePrev} className="btn btn-dark">&larr;Previous</button>
        <button type="button" disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pagesize)} onClick={this.handleNext} className="btn btn-dark">Next&rarr;</button>

        </div> */}
   
    
    </>
    )
  
}
News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}
