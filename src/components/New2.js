import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import base64 from 'base-64';
import utf8 from 'utf8';

export default function News(props) {
  const [Articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const COUNTRIES = ['us', 'gb', 'au', 'fr', 'ru'];
  const CATEGORIES = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  useEffect(() => {
    document.title = `Top Headlines - News App`;
    updateAllCategories();
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
      setArticles(data);

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
        console.log(`Updated: ${filename}`);
      } else {
        console.log(`No changes to push for ${filename}.`);
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
        console.log(`Created: ${filename}`);
      } else {
        console.error('Error pushing to GitHub:', error);
      }
    }
  };

  const fetchTopHeadlines = async (category, country) => {
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${props.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const updateAllCategories = async () => {
    setLoading(true);
    try {
      for (const category of CATEGORIES) {
        for (const country of COUNTRIES) {
          console.log(`Fetching category: ${category}, country: ${country}`);
          const fetchedData = await fetchTopHeadlines(category, country);

          // Push data to GitHub
          const filename = `top-headlines/${category}/${country}.json`;
          await pushToGitHub(filename, fetchedData);
        }
      }
    } catch (error) {
      console.error('Error updating categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center" style={{ marginTop: '90px' }}>
        News App - Top Headlines
      </h1>
      {loading && (
        <div className="text-center">
          <Spinner />
        </div>
      )}

      <div className="container">
        <div className="row">
          {Articles.map((article) => (
            <div className="col-md-4" key={article.url}>
              <NewsItem
                title={article.title ? article.title.slice(0, 45) : ''}
                desc={
                  article.description
                    ? article.description.slice(0, 150)
                    : 'Click the button to read more'
                }
                newsurl={article.url}
                imageurl={
                  article.urlToImage ||
                  'https://cdn.arstechnica.net/wp-content/uploads/2017/12/GettyImages-837481992-760x380.jpg'
                }
                author={article.author}
                date={article.publishedAt}
                source={article.source.name}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
