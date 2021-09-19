const puppeteer = require('puppeteer');
const login = require("./credentials");
const linksObj = require("./linkedInLinks");
const path = require("path");


// for taking screenshots of skills
(async () => {
    const browser = await puppeteer.launch({headless:false,args: ['--allow-file-access-from-files', '--enable-local-file-accesses','--disable-notifications','--start-maximized'],defaultViewport:null});
  const page = await browser.newPage();
  await page.goto("https://www.linkedin.com/login");
  await waitAndClick('#username',page);
  await page.type("#username",login.email,{delay:150});
  await page.type("#password",login.password,{delay:150});
  await page.click('button[type="submit"]');
  await page.waitFor(20000);
  for(let i=0;i<linksObj.links.length;i++){
   await page.goto(linksObj.links[i], {waitUntil: 'networkidle2'});
  await autoScroll(page);
  await waitAndClick(".pv-profile-section__card-action-bar.pv-skills-section__additional-skills.artdeco-container-card-action-bar.artdeco-button.artdeco-button--tertiary.artdeco-button--3.artdeco-button--fluid.artdeco-button--muted",page);

  let profileName = path.basename(linksObj.links[i])
  await page.screenshot({path:`Skills_Screenshots/${profileName}.jpeg`, FullPage:true});
  page.waitFor(5000);
  }
 await browser.close();
})();


// for pdf creation
(async () => {
  const browser = await puppeteer.launch({headless:true,args: ['--allow-file-access-from-files', '--enable-local-file-accesses','--disable-notifications','--start-maximized'],defaultViewport:null});
const page = await browser.newPage();
await page.goto("https://www.linkedin.com/login");
await waitAndClick('#username',page);
await page.type("#username",login.email,{delay:70});
await page.type("#password",login.password,{delay:70});
await page.waitFor(2000);
await page.click('button[type="submit"]')
await page.waitFor(20000);

for(let i=0;i<linksObj.links.length;i++){
  await page.goto(linksObj.links[i], {waitUntil: 'networkidle2'});
  await autoScroll(page);
  await waitAndClick(".pv-profile-section__card-action-bar.pv-skills-section__additional-skills.artdeco-container-card-action-bar.artdeco-button.artdeco-button--tertiary.artdeco-button--3.artdeco-button--fluid.artdeco-button--muted",page);
  let profileName = path.basename(linksObj.links[i])
  await page.pdf({path: `Profile_Pdf/${profileName}.pdf`, format: 'A6',printBackground:true,scale:0.5,landscape:true});
  page.waitFor(5000);
 }
await browser.close();
})();


async function waitAndClick(selector, currentPage){
  await currentPage.waitForSelector(selector);
  return currentPage.click(selector);
}
async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 200);
      });
  });
}
