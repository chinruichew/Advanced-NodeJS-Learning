const Page = require('./helpers/page');

let page;

// Executed automatically before page runs
beforeEach(async() => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

// Executed automatically after page runs
afterEach(async() => {
    await page.close();
});

test('When logged in, can see blog creation form', async() => {
    await page.login();
});