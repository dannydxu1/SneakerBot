const puppeteer = require('puppeteer');
const home = "https://3dkeebs.com/collections/switches";
const target = "https://3dkeebs.com/collections/switches/products/sunflower-pom-switch";

//shipping info
const email = 'johndoe@gmail.com';
const name1 = 'John';
const name2 = 'Doe';
const address = '12338 Radisson Road Northeast';
const city = 'Blaine';
const zip = '55449';
const phone = '9524862423';

//billing info
const number = '4420959690237960377';
const name = name1 + name2;
const date = '12/30';
const cvv = '087'

async function givePage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return page;
}

async function addToCart(page) {
    
    await page.click('#AddToCart');
    await page.waitForSelector('button[name="checkout"]');
    await page.click('button[name="checkout"]');
}
async function checkout() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(target, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(100);
    await addToCart(page);
    await fillShipping(page);
    await console.log("successfuly parsed through end of code");
    await browser.close();
}

async function testBilling() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(target, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(100);
    await addToCart(page);
    await fillShipping(page);
    await fillBilling(page);
}

async function fillPhone(page) {
    for (let i = 0; i < phone.length; i++) {
        let num = phone[i];
        await page.type('#checkout_shipping_address_phone', num);
    }
}

async function getDelay(min, max) {
    let delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("current delay:"+delay);
    return delay;
}

async function fillShipping(page) {
    //--On Shipment Info Page--
    await page.waitForTimeout(getDelay(10,50));
    await page.waitForSelector('#checkout_email_or_phone');
    await page.type('#checkout_email_or_phone', email);
    await page.waitForTimeout(getDelay(10,50));
    await page.waitForSelector('#checkout_shipping_address_first_name');
    await page.type('#checkout_shipping_address_first_name', name1);
    await page.waitForTimeout(getDelay(50,150)); 
    await page.waitForSelector('#checkout_shipping_address_last_name');
    await page.type('#checkout_shipping_address_last_name', name2);
    await page.waitForTimeout(300); //bugs out when putting address, need delay yto be a certian amt
    await page.waitForSelector('#checkout_shipping_address_address1');
    await page.type('#checkout_shipping_address_address1', address);
    await page.waitForTimeout(getDelay(50,200));
    await page.waitForSelector('#checkout_shipping_address_city');
    await page.type('#checkout_shipping_address_city', city);
    await page.waitForTimeout(getDelay(50,200));
    await page.waitForSelector('#checkout_shipping_address_zip');
    await page.type('#checkout_shipping_address_zip', zip);
    await page.waitForTimeout(getDelay(100,200));
    await page.waitForSelector('#checkout_shipping_address_phone');
    await fillPhone(page);
    await page.waitForTimeout(getDelay(50,200));
    await page.waitForSelector('#continue_button');
    await page.click('#continue_button');
    //--Now On Select Shipping Option Page--
    //want to add a way to make it wait for Continue to payment to show
    await page.waitForTimeout(getDelay(3000,6000));
    await page.waitForSelector('#continue_button');
    await page.click('#continue_button');

}

async function fillBilling(page) {
    await page.waitForTimeout(1000);
    await page.waitForSelector('#number');
    await page.type('#number', number);
    await console.log("success");
   
    /*
    await page.evaluate(() => { document.querySelector("#number")[1].click(); });
    await page.$eval('#number', el => el.value = '9524862423');

    document.querySelector("#number")
    
    await page.waitForTimeout(200);
    await page.evaluate(() => { document.querySelector("#number")[1].type(number); });
    
    await page.waitForSelector('#number');
    await page.type('#number', number);
    await page.waitForTimeout(1000);

    await page.waitForTimeout(1000);
    await page.waitForSelector('#name');
    await page.type('#name', name);

    await page.waitForTimeout(1000);
    await page.waitForSelector('#expiry');
    await page.type('#expiry', date);

    await page.waitForTimeout(1000);
    await page.waitForSelector('#verification_value');
    await page.type('#verification_value', cvv);
    */
}



async function celebrate(page) {
    await page.waitForTimeout(1000);
    //await page.waitForSelector('#continue_button');
    //await page.click('#continue_button');
    await page.screenshot({ path: 'proofscreenshot.png' });
    browser.close();
}
//   await page.click("button[class='btn btn--wide btn--secondary']", elem=> elem.click());

testBilling();
