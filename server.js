const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/scrape', async (req, res) => {
  try {
    // Fetch the main page
    const mainPageResponse = await axios.get('https://v2raydog.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(mainPageResponse.data);

    // Find the latest post link (first h2 with a link to /freenode/)
    let latestCardUrl = null;
    let latestTitle = '';
    let latestDate = '';

    $('h2 a').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && href.includes('/freenode/')) {
        latestCardUrl = href;
        latestTitle = $(elem).text().trim();
        return false; // break after finding the first one
      }
    });

    // Extract date from title (format: YYYY年MM月DD日)
    const dateMatch = latestTitle.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2].padStart(2, '0');
      const day = dateMatch[3].padStart(2, '0');
      latestDate = `${year}-${month}-${day}`;
    }

    // Make URL absolute if needed
    if (latestCardUrl && !latestCardUrl.startsWith('http')) {
      latestCardUrl = 'https://v2raydog.com' + latestCardUrl;
    }

    if (!latestCardUrl) {
      return res.json({ error: 'Could not find latest card URL' });
    }

    // Fetch the card detail page
    const detailPageResponse = await axios.get(latestCardUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $detail = cheerio.load(detailPageResponse.data);

    // Find latest check time (最新检测时间)
    let checkTime = '';
    $detail('*').each((i, elem) => {
      const text = $detail(elem).text();
      if (text.includes('最新检测时间')) {
        const timeMatch = text.match(/最新检测时间[:：]\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?)/);
        if (timeMatch) {
          checkTime = timeMatch[1];
          return false; // break after finding
        }
      }
    });

    // Find Clash / Mihomo subscription URL (YAML file for Clash/Mihomo)
    let subscriptionUrl = '';

    // Look for .yaml links in the subscription section
    $detail('a').each((i, elem) => {
      const href = $detail(elem).attr('href');
      if (href && href.endsWith('.yaml')) {
        subscriptionUrl = href;
        return false; // break after finding the first YAML link
      }
    });

    res.json({
      title: latestTitle,
      date: checkTime || latestDate,
      subscriptionUrl: subscriptionUrl
    });

  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stop', (req, res) => {
  res.json({ message: 'Server stopping' });
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  open(`http://localhost:${PORT}`);
});
