const puppeteer = require('puppeteer');

let browser, page;

// Executed automatically before page runs
beforeEach(async() => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

// Executed automatically after page runs
afterEach(async() => {
    await browser.close();
});

test('The header has correct text', async() => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async() => {
    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});