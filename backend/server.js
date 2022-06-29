const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

const axios = require('axios').default;

const API_KEY = 'c7tdevaad3i8dq4u0gd0';

app.get('/api/basicInfo', (req, res) => {
    setData(res, getCompanyBasicInfo(req.query.ticker));
});

app.get('/api/autoComplete', (req, res) => {
    setData(res, getAutoComplete(req.query.probableTicker));
});

app.get('/api/quote', (req, res) => {
    setData(res, getQuote(req.query.ticker));
});

app.get('/api/historicalData', (req, res) => {
    setData(res, getHistoricalData(req.query.ticker, req.query.from, req.query.to, req.query.resolution));
});

app.get('/api/recommendationTrends', (req, res) => {
    setData(res, getRecommendationTrend(req.query.ticker));
});

app.get('/api/companyNews', (req, res) => {
    setData(res, getCompanyNews(req.query.ticker));
});

app.get('/api/sentiment', (req, res) => {
    setData(res, getSocialSentiment(req.query.ticker));
});

app.get('/api/companyPeers', (req, res) => {
    setData(res, getCompanyPeers(req.query.ticker));
});

app.get('/api/companyEarnings', (req, res) => {
    setData(res, getCompanyEarnings(req.query.ticker));
});

function setData(res, promise)
{
    promise.then(
        result => {
            //console.log(JSON.stringify(result));
            res.json(result);
        }
    ).catch(function (error) {
        console.log("Some exception occured while fetching data for URL ");
        console.log(error);
        res.json({"error":"API Limit Reached"});
    });
}

function getCompanyBasicInfo(ticker) {
    let config = {
        params: {
            symbol: ticker,
            token: API_KEY
        }
    };

    let BASIC_INFO_URL = 'https://finnhub.io/api/v1/stock/profile2';
    return getDataFromFinhub(BASIC_INFO_URL, config);
}

function getHistoricalData(ticker, from, to, resolution) {
    let config = {
        params: {
            symbol: ticker,
            resolution: resolution,
            from: from,
            to: to,
            token: API_KEY,
        }
    };

    let COMPANY_HISTORY_URL = 'https://finnhub.io/api/v1/stock/candle';
    return getDataFromFinhub(COMPANY_HISTORY_URL, config);
}

function getQuote(ticker) {
    let config = {
        params: {
            symbol: ticker,
            token: API_KEY
        }
    };

    let QUOTE_URL = 'https://finnhub.io/api/v1/quote';
    return getDataFromFinhub(QUOTE_URL, config);
}

function getAutoComplete(probableTicker) {
    let config = {
        params: {
            q: probableTicker,
            token: API_KEY
        }
    };

    let AUTO_COMPLETE_URL = 'https://finnhub.io/api/v1/search';
    return getDataFromFinhub(AUTO_COMPLETE_URL, config);
}

function getCompanyNews(ticker) {
    let config = {
        params: {
            symbol: ticker,
            from: getOneMonthBackDateInISO(),
            to: getCurrentDateInISO(),
            token: API_KEY
        }
    };

    let COMPANY_NEWS_URL = 'https://finnhub.io/api/v1/company-news';
    return getDataFromFinhub(COMPANY_NEWS_URL, config);
}

function getRecommendationTrend(ticker) {
    let config = {
        params: {
            symbol: ticker,
            token: API_KEY
        }
    };

    let RECOMMENDATION_TREND_URL = 'https://finnhub.io/api/v1/stock/recommendation';
    return getDataFromFinhub(RECOMMENDATION_TREND_URL, config);
}

function getSocialSentiment(ticker) {
    let config = {
        params: {
            symbol: ticker,
            from: '2022-01-01',
            token: API_KEY
        }
    };

    let SOCIAL_SENTIMENT_URL = 'https://finnhub.io/api/v1/stock/social-sentiment';
    return getDataFromFinhub(SOCIAL_SENTIMENT_URL, config);
}

function getCompanyPeers(ticker) {
    let config = {
        params: {
            symbol: ticker,
            token: API_KEY
        }
    };

    let COMPANY_PEER_URL = 'https://finnhub.io/api/v1/stock/peers';
    return getDataFromFinhub(COMPANY_PEER_URL, config);
}

function getCompanyEarnings(ticker) {
    let config = {
        params: {
            symbol: ticker,
            token: API_KEY
        }
    };

    let COMPANY_EARNINGS_URL = 'https://finnhub.io/api/v1/stock/earnings';
    return getDataFromFinhub(COMPANY_EARNINGS_URL, config);
}

function getDataFromFinhub(URL, config) {
    return axios.get(URL, config).then(response => response.data);
         //returns a promise object
}

function getSixMonthBackEpoch() {
    let d = new Date();
    d.setMonth(d.getMonth() - 6);
    return Math.round(d.getTime() / 1000);

}

function getCurrentEpoch() {
    let d = new Date();
    return Math.round(d.getTime() / 1000);
}

function getOneMonthBackDateInISO() {
    let d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
}

function getCurrentDateInISO() {
    let d = new Date();
    return d.toISOString().slice(0, 10);
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});