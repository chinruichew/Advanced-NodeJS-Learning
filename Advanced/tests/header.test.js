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

test('When signed in, shows logout button', async() => {
    const id = '5ac75171a7197314dcc2df27';
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: id
        }
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

    const Keygrip = require('keygrip');
    const keys = require('../config/keys');
    const keygrip = new Keygrip([keys.cookieKey]);
    const sig = keygrip.sign('session=' + sessionString);

    await page.setCookie({name: 'session', value: sessionString});
    await page.setCookie({name: 'session.sig', value: sig});
    await page.goto('http://localhost:3000');
    await page.waitFor("a[href='/auth/logout']");

    const text = await page.$eval("a[href='/auth/logout']", el => el.innerHTML);
    expect(text).toEqual('Logout');
});