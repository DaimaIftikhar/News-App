import React, { useEffect,useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
const News=(props)=>{
  const[articles,setArticles]=useState([])
  const[loading,setLoading]=useState(true)
  const[page,setPage]=useState(1)
  const[totalResults,setTotalResults]=useState(0)
 
 
  const capitalizeFirstLetter=(string)=>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

   const updateNews=async(pageNO)=>{
    props.setProgress(0);
    const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=6a1ba749ddbc401b8ef26201cf4f128d&page=${page}&pageSize=${props.pagesize}`
   
   setLoading(true);
    let data= await fetch(url);
    props.setProgress(30);
    let parseddata= await data.json();
    props.setProgress(70);
    setArticles(parseddata.articles)
    setTotalResults(parseddata.totalResults)
    setLoading(false)
    props.setProgress(100);
  }
  useEffect(()=>{
      document.title=`${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  },[])
  
  // handleNextClick= async()=>{
 
  // this.setState({page:this.state.page+1});
  // this.updateNews();
  // }

  
  // handlePrevClick=async()=>{
  //   this.setState({page:this.state.page-1});
  //   this.updateNews();
  // }
  const fetchMoreData = async() => {
    setPage(page+1)
    const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=6a1ba749ddbc401b8ef26201cf4f128d&page=${page+1}&pageSize=${props.pagesize}`
    
    let data= await fetch(url);
    let parseddata= await data.json();
    setArticles(articles.concat( parseddata.articles))
    setTotalResults(parseddata.totalResults)
  };

 {
   
    return (
      <>
      
        <h1 className="text-center" style={{margin:"35px 0px",marginTop:"80px"}}>NewsMonkey -Top {capitalizeFirstLetter(props.category)} Headlines</h1>
     {loading&& <Spinner/>}
     <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length!==totalResults}
          loader={<Spinner/>}
        ><div className='container my-3'>
         <div className="row my-3">
         {articles.map((element)=>{
  return <div className="col-md-4"  key={element.url} >
    <NewsItem title={element.title?element.title.slice(0, 45):""} discription={element.description?element.description.slice(0, 85):""} imageurl={element.urlToImage?element.urlToImage:"https://www.usatoday.com/gcdn/authoring/authoring-images/2024/09/05/USAT/75093504007-u-smapwithchargers.png?crop=5219,2936,x474,y416&width=3200&height=1801&format=pjpg&auto=webp"} Newsurl={element.url} author={element.author?element.author:"Unkmown"} date={element.publishedAt} source={element.source} /></div>
          })}
        </div>
        
         </div>
         </InfiniteScroll>
           
      
      </>
    )
 }
}
News.defaultProps={
  country:"us",
  pagesize:8,
  category:"general"
}
News.propTypes={
  country:PropTypes.string,
  pagesize:PropTypes.number,
  category:PropTypes.string,
}
export default News