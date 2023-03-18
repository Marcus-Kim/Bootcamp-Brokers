import { Link } from "react-router-dom";

export default function News({ newsObject, numArticlesDisplayed }) {
  
  // Convert timestamp from Stock News API into readable time passed format
  // Eg. "20230318T153400" => "30m" or "1h" etc.
  const timePassed = (timestamp) => {
    const year = parseInt(timestamp.slice(0, 4), 10);
    const month = parseInt(timestamp.slice(4, 6), 10) - 1; // Months are 0-indexed in JavaScript
    const day = parseInt(timestamp.slice(6, 8), 10);
    const hours = parseInt(timestamp.slice(9, 11), 10);
    const minutes = parseInt(timestamp.slice(11, 13), 10);
  
    const articleDate = new Date(Date.UTC(year, month, day, hours, minutes));
    const currentDate = new Date();
  
    const msDifference = currentDate - articleDate;
    const minutesDifference = msDifference / (1000 * 60);
    const hoursDifference = msDifference / (1000 * 60 * 60);
    const daysDifference = msDifference / (1000 * 60 * 60 * 24);
  
    if (minutesDifference < 60) {
      return Math.ceil(minutesDifference) + "m";
    } else if (hoursDifference < 24) {
      return Math.ceil(hoursDifference) + "h";
    } else {
      return Math.ceil(daysDifference) + "d";
    }
  }

  return (
    <>
      {newsObject?.feed?.slice(0, numArticlesDisplayed).map((news) => (
        <Link to={news.url} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
          <div className="news-carders" key={news.url}>
            <hr className="break" />
            <div className="news-card">
              <div className="news-cardleft">
                <div>
                  <span className="source">{news.source}</span>{" "}
                  <span className="time-units">{timePassed(news.time_published)}</span>
                </div>
                <div className="title">{news.title}</div>
                <div className="story-ticker">
                  {news.ticker_sentiment[0]?.ticker}
                </div>
              </div>
              <a href={news.url} target="_blank" rel="noopener noreferrer">
                <img className="news-image" src={news.banner_image} alt="" />
              </a>
            </div>
          </div>
        </Link>
      ))}
    </>
  )
}
