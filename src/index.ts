#!/usr/bin/env node

import { Command } from 'commander';
import { generateSitemap, validateSitemap } from "./sitemaper.js";
import { existsSync } from 'fs';
import { URL } from 'url';

const program = new Command();

// Helper function to validate depth is a positive integer
const validateDepth = (depth: string) => {
    const parsedDepth = parseInt(depth, 10);
    if (isNaN(parsedDepth) || parsedDepth < 1) {
        throw new Error('Depth must be a positive integer greater than 0.');
    }
    return parsedDepth;
};

// Helper function to validate changefreq value
const validateChangefreq = (changefreq: string) => {
    const validOptions = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (!validOptions.includes(changefreq)) {
        throw new Error(`Invalid changefreq value. Accepted values are: ${validOptions.join(', ')}`);
    }
    return changefreq;
};

// Helper function to validate website URL
const validateWebsite = (website: string) => {
    try {
        new URL(website);
        return website;
    } catch (error) {
        throw new Error('Invalid website URL.');
    }
};

// Helper function to validate output path (for example, it checks if the directory exists)
const validateOutput = (output: string) => {
    const pathParts = output.split('/');
    const dirPath = pathParts.slice(0, -1).join('/');
    if (dirPath && !existsSync(dirPath)) {
        throw new Error(`The directory ${dirPath} does not exist.`);
    }
    return output;
};

program
  .name('sitemaper')
  .description('Simple tool for generating sitemaps for your website.')
  .version('1.0.0');

program
  .option('-w, --website <url>', 'The URL of the website to crawl', validateWebsite)
  .option('-r, --replacer <url>', 'The URL of the website to be replaced', validateWebsite)
  .option('-d, --depth <number>', 'Depth of the website to crawl', validateDepth)
  .option('-o, --output <path>', 'Output path for the sitemap.xml', validateOutput)
  .option('-f, --changefreq <value>', 'Change frequency for the sitemap (always, hourly, daily, weekly, monthly, yearly, never)', validateChangefreq)
  .action((options) => {
      const website = options.website || 'https://www.example.com';
      const replacer = options.replacer || '';
      const depth = options.depth || 10;
      const output = options.output || './sitemap.xml';
      const changefreq = options.changefreq || 'daily';

      // console.log({ website, replacer, depth, output, changefreq });

      return generateSitemap(website, replacer, depth, output, changefreq);
  });

export { generateSitemap, validateSitemap };

program.parse(process.argv);
