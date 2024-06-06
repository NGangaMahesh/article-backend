import express from 'express'
import cors from 'cors'
import scrapeMedium from './scraper.js'

const app = express();
app.use(cors());
app.use(express.json());

let articles = [];

app.post('/scrape', async (req, res) => {
  const { topic } = req.body;
  try {
    articles = await scrapeMedium(topic);
    await res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape articles' });
  }
});

app.get('/articles', (req, res) => {
  res.status(200).json(articles);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
