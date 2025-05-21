import cron from 'node-cron';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import Article from '../models/Article.js';
import Category from '../models/Category.js';

// Load environment variables based on NODE_ENV
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: path.resolve(__dirname, '../..', envFile) });

// Function to create slug from title
const createSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
};

// Function to scrape categories from Tuoi Tre
const scrapeCategories = async () => {
  try {
    logger.info('Starting category scraping...');
    const response = await axios.get(process.env.TUOITRE_URL);
    const $ = cheerio.load(response.data);

    // Get main categories from the navigation menu
    const categories = [];
    $('.menu-header li.menu-header__item').each((i, el) => {
      const name = $(el).find('a').text().trim();
      const url = $(el).find('a').attr('href');

      if (name && url && !url.includes('#')) {
        const fullUrl = url.startsWith('http') ? url : `${process.env.TUOITRE_URL}${url}`;
        const slug = createSlug(name);

        categories.push({
          name,
          slug,
          url: fullUrl
        });
      }
    });

    // Save categories to database
    for (const category of categories) {
      await Category.findOrCreate({
        where: { slug: category.slug },
        defaults: category
      });
    }

    logger.info(`Scraped ${categories.length} categories successfully`);
    return categories;
  } catch (error) {
    logger.error(`Error scraping categories: ${error.message}`);
    return [];
  }
};

// Function to scrape articles from a category
const scrapeArticles = async (category) => {
  try {
    logger.info(`Scraping articles from category: ${category.name}`);
    const response = await axios.get(category.url);
    const $ = cheerio.load(response.data);

    const articles = [];
    $('.news-item').each((i, el) => {
      const title = $(el).find('.news-item__title a').text().trim();
      const sourceUrl = $(el).find('.news-item__title a').attr('href');
      const summary = $(el).find('.news-item__sapo').text().trim();
      const imageUrl = $(el).find('.news-item__avatar img').attr('src') || $(el).find('.news-item__avatar img').attr('data-src');

      if (title && sourceUrl) {
        const fullUrl = sourceUrl.startsWith('http') ? sourceUrl : `${process.env.TUOITRE_URL}${sourceUrl}`;
        const slug = createSlug(title);

        articles.push({
          title,
          slug,
          summary,
          imageUrl,
          sourceUrl: fullUrl,
          categoryId: category.id,
          publishedAt: new Date()
        });
      }
    });

    // Save articles to database
    for (const article of articles) {
      // Check if article already exists by slug
      const existingArticle = await Article.findOne({ where: { slug: article.slug } });
      if (!existingArticle) {
        await Article.create(article);
      }
    }

    logger.info(`Scraped ${articles.length} articles from category ${category.name}`);
    return articles;
  } catch (error) {
    logger.error(`Error scraping articles from category ${category.name}: ${error.message}`);
    return [];
  }
};

// Function to scrape article content
const scrapeArticleContent = async (article) => {
  try {
    logger.info(`Scraping content for article: ${article.title}`);
    const response = await axios.get(article.sourceUrl);
    const $ = cheerio.load(response.data);

    // Extract article content
    let content = '';
    $('.detail-content p').each((i, el) => {
      content += $(el).text().trim() + '\\n\\n';
    });

    // Update article with content
    await Article.update(
      { content },
      { where: { id: article.id } }
    );

    logger.info(`Scraped content for article: ${article.title}`);
  } catch (error) {
    logger.error(`Error scraping content for article ${article.title}: ${error.message}`);
  }
};

// Main scraping function
const runScraper = async () => {
  try {
    logger.info('Starting scraper job...');

    // Step 1: Scrape categories
    const categories = await scrapeCategories();

    // Step 2: For each category, scrape articles
    for (const category of categories) {
      // Get category from database to get the ID
      const dbCategory = await Category.findOne({ where: { slug: category.slug } });
      if (dbCategory) {
        const articles = await scrapeArticles(dbCategory);

        // Step 3: For each new article, scrape content
        for (const article of articles) {
          const dbArticle = await Article.findOne({ where: { slug: article.slug } });
          if (dbArticle && !dbArticle.content) {
            await scrapeArticleContent(dbArticle);
          }
        }
      }
    }

    logger.info('Scraper job completed successfully');
  } catch (error) {
    logger.error(`Error in scraper job: ${error.message}`);
  }
};

// Schedule cron job to run every 30 minutes
cron.schedule(process.env.SCRAPE_INTERVAL, () => {
  runScraper();
});

// Run scraper immediately on startup
logger.info('Initializing scraper...');
runScraper();

export default runScraper;