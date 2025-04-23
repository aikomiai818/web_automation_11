import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';
import firefox from 'selenium-webdriver/firefox.js';

import fs from 'fs';
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import page_login from '../pom_pages/page_login.js';
import page_sort from '../pom_pages/page_sort.js';

describe('Test Saucedemo', function () {
    let driver;

    beforeEach(async function () {
        let options = new firefox.Options();
        driver = await new Builder().forBrowser('firefox').build();

        // driver = await new Builder().forBrowser('firefox').build();

        await driver.get('https://www.saucedemo.com');
        const title = await driver.getTitle();

        // assert: memastikan object sama persis
        assert.strictEqual(title, 'Swag Labs');

        // inputs
        let inputUsername = await driver.findElement(By.css('[data-test="username"]'))
        let inputUsernamePOM = await driver.findElement(page_login.inputUsername)

        let inputPassword = await driver.findElement(By.xpath('//*[@data-test="password"]'))
        let buttonLogin = await driver.findElement(By.className('submit-button btn_action'))
        await inputUsernamePOM.sendKeys('standard_user')
        await inputPassword.sendKeys('secret_sauce')
        await buttonLogin.click()
    });

    it('Check sort Z-A', async function () {
        let kliksort = await driver.findElement(page_sort.list_sort);
        await kliksort.click();
        let optionZA = await driver.findElement(page_sort.sort_za);
        await optionZA.click();
    });

    it('Check sort A-Z', async function () {
        let kliksort = await driver.findElement(page_sort.list_sort);
        await kliksort.click();
        let optionAZ = await driver.findElement(page_sort.sort_az);
        await optionAZ.click();
    });

    it('Check sort Price High to Low', async function () {
        let kliksort = await driver.findElement(page_sort.list_sort);
        await kliksort.click();
        let optionHilo = await driver.findElement(page_sort.sort_hilo);
        await optionHilo.click();
    });

    afterEach(async function () {
        await driver.sleep(5000);
        await driver.quit();
    });
});

describe('Test compare skrinsut', function () {
    let driver;

it('Cek Visual halaman login', async function () {
    // visit page
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get('https://www.saucedemo.com');

    const title = await driver.getTitle();
    assert.strictEqual(title, 'Swag Labs');

    // screenshot keadaan login page sekarang, current.png
    let screenshot = await driver.takeScreenshot();
    let imgBuffer = Buffer.from(screenshot, "base64");
    fs.writeFileSync("current.png", imgBuffer);

    // ambil baseline untuk komparasi
    // jika belum ada baseline, jadikan current.png sebagai baseline
    if (!fs.existsSync("baseline.png")) {
        fs.copyFileSync("current.png", "baseline.png");
        console.log("Baseline image saved.");
    }

    // Compare baseline.png dan current.png apakah sama
    let img1 = PNG.sync.read(fs.readFileSync("baseline.png"));
    let img2 = PNG.sync.read(fs.readFileSync("current.png"));
    let { width, height } = img1;
    let diff = new PNG({ width, height });

    let numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });

    fs.writeFileSync("diff.png", PNG.sync.write(diff));

    if (numDiffPixels > 0) {
        console.log(`Visual differences found! Pixels different: ${numDiffPixels}`);
    } else {
        console.log("No visual differences found.");
    }

    driver.quit()

});
});