import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import base64 from 'base-64';
import utf8 from 'utf8';
export default function News(props) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const [Articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey App`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  const pushToGitHub = async (filename, content) => {
    const GITHUB_API_TOKEN = process.env.REACT_APP_GITHUB_API_TOKEN;
    const GITHUB_REPO = process.env.REACT_APP_GITHUB_REPO; // e.g., "username/repo-name"
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filename}`;
    const jsonString = JSON.stringify(content, null, 2);
    const utf8Content = utf8.encode(jsonString);
    const base64Content = base64.encode(utf8Content); // Convert JSON to base64

    try {
      const response = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_API_TOKEN}` },
      });
      const data = await response.json();

      const sha = data.sha;
      if (base64Content !== data.content?.replace(/\n/g, '')) {
        // Update existing file
        await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Update ${filename}`,
            content: base64Content,
            sha,
          }),
        });
      } else {
        console.log('No changes to push.');
      }
    } catch (error) {
      if (error.status === 404) {
        // Create new file if it doesn't exist
        await fetch(url, {
          method: 'PUT',
          headers: {
            Authorization: `token ${GITHUB_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Create ${filename}`,
            content: base64Content,
          }),
        });
      } else {
        console.error('Error pushing to GitHub:', error);
      }
    }
  };

  const updateNews = async () => {
    props.setProgress(0);
    const url = `https://newsapi.org/v2/top-headlines?category=${props.category}&apiKey=${props.apiKey}`;
    setLoading(true);

    try {
      props.setProgress(30);
      const data = await fetch(url);
      const parsedData = await data.json();
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);

      // Push fetched data to GitHub
      const filename = `top-headlines/${props.category}.json`;
      await pushToGitHub(filename, parsedData);

      props.setProgress(100);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const newPage = page + 1;
    const url = `https://newsapi.org/v2/top-headlines?category=${props.category}&apiKey=${props.apiKey}`;
    setLoading(true);

    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      setArticles(Articles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
      setLoading(false);
      setPage(newPage);

      // Push fetched data to GitHub
      const filename = `top-headlines/${props.category}-${newPage}.json`;
      await pushToGitHub(filename, parsedData);
    } catch (error) {
      console.error('Error fetching more news:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center" style={{ marginTop: '90px' }}>
        NewsMonkey | {capitalize(props.category)} Top Headlines
      </h1>
      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}

      <InfiniteScroll
        dataLength={Articles.length} // This is important to handle pagination
        next={fetchData}
        hasMore={Articles.length !== totalResults}
        loader={
          <div className="text-center">
            <Spinner />
          </div>
        }
      >
        <div className="container">
          <div className="row">
            {Articles.map((ele) => {
              return (
                <div className="col-md-4" key={ele.url}>
                  <NewsItem
                    title={ele.title ? ele.title.slice(0, 45) : ''}
                    desc={
                      ele.description
                        ? ele.description.slice(0, 150)
                        : 'Click the button to read more'
                    }
                    newsurl={ele.url}
                    imageurl={
                      !ele.urlToImage
                        ? 'https://cdn.arstechnica.net/wp-content/uploads/2017/12/GettyImages-837481992-760x380.jpg'
                        : ele.urlToImage
                    }
                    author={ele.author}
                    date={ele.publishedAt}
                    source={ele.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
}

News.defaultProps = {
  pageSize: 8,
  category: 'general',
};

News.propTypes = {
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
