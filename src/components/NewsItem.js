import React from 'react'

export default function NewsItem(props) {
  
 
    
       
    let {title,desc ,imageurl,newsurl,author,date,source}=props;
    return (
    
      <div className="my-3"><div className="card" >
         <div><span className=" badge rounded-pill bg-danger" style={{    position: 'absolute',
    right: '0' }}>{source}
            
            </span></div>
    
                <img src={imageurl} className="card-img-top" alt="..."/>
                <div className="card-body">
               
                <h5 className="card-title">{title}</h5>
                              <p className="card-text">{desc}</p>
                <p className="card-text"><small className="text-body-secondary">By {!author?"Unknown":author} on {new Date(date).toGMTString()}</small></p>
                <a href={newsurl} target="_blank" rel="noreferrer" className="btn btn-primary">Read More</a>
              
     
    </div>
  </div>

    
    
    
    </div>
    )
  

    }