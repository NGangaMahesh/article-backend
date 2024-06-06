import puppeteer from 'puppeteer';

async function scrapeMedium(topic) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(`https://medium.com/search?q=${topic}`, { waitUntil: 'networkidle2' });
  
    // Wait for the articles container to load
    await page.waitForSelector('#root > div > div.l.c > div.ca.cb.l > div > main > div > div > div:nth-child(2) > div');
  
    const articles = await page.evaluate(() => {
      let results = [];
      let items = document.querySelectorAll('#root > div > div.l.c > div.ca.cb.l > div > main > div > div > div:nth-child(2) > div > div:nth-child(n)');
      items.forEach((item, index) => {
        if (index < 5) { // Limit to the first 5 articles
          let title = item.querySelector('h2')?.innerText || 'No title';
          let author = item.querySelector('p')?.innerText || 'No author';
          let authorProfile = item.querySelector('article > div > div > div > div > div:nth-child(1) > div > div:nth-child(1) > div > div.fy.l > div > div > a > div > img')?.getAttribute('src')
          let publicationDate = item.querySelector('article > div > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div.l.ck.ko > div.h.k.i > a > span > div')?.innerText || 'No date';
          let url = item.querySelector('article > div > div > div > div > div:nth-child(1)')?.getAttribute('data-href');
          let likeCount = item.querySelector('article > div > div > div > div > div:nth-child(1) > div > div.kj.j.d > div > div.am.nr.ns.nt.nu.nv.nw.nx.ny.nz.oa.ab.q > div.ab.q.cc.ob > div.pw-multi-vote-count.l.oo.op.oq.or.os.ot.ou > div > div > p > button')?.innerText || '0';
          let commentCount = item.querySelector('article > div > div > div > div > div:nth-child(1) > div > div.kj.j.d > div > div.am.nr.ns.nt.nu.nv.nw.nx.ny.nz.oa.ab.q > div.ow.l > div > div > a > p > span')?.innerText || '0';
          results.push({ title, author, authorProfile, likeCount, commentCount, publicationDate, url });
        }
      });
      return results;
    });
  
    await browser.close();
    return articles;
  }
export default scrapeMedium;