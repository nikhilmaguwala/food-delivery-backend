const puppeteer = require('puppeteer');

function isValidHttpUrl(string) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(string);
}

function getDomain(url) {
    if(url.includes('swiggy')){
        return 'swiggy'
    } else if (url.includes('zomato')) {
        return 'zomato'
    }
    return ''
}

const scrapRestaurant = async (url) => {
    console.log('Scraping Url: ' + url)
    if(url === '') {
        return {
            error: 'Please Enter Proper Link'
        }
    }
    if(!isValidHttpUrl(url)) {
        return {
            error: 'Please Enter Valid Url'
        }
    }
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox','--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        console.log('Site:', getDomain(url))
        if(getDomain(url) === 'swiggy') {
            await page.goto(url);
            const data = await page.evaluate(() => {
                const title = document.querySelector('._3aqeL').innerText;
                const categories_ele = document.querySelector('._3Plw0');
                const childNodes = categories_ele.childNodes;
                let categories = '';
                for (let i = 0; i < childNodes.length; i++) {
                    if(childNodes[i].nodeType === 3) {
                        categories += childNodes[i].data;
                    }
                }
                const rating = document.querySelector('div._2iUp9:nth-child(1) > div:nth-child(1) > span:nth-child(1)').innerText
                const location = document.querySelector('.Gf2NS').innerText;
                const city = document.querySelector('._2p-Tc > span:nth-child(3) > a:nth-child(1) > span:nth-child(1)').innerText
                const links = document.querySelectorAll('.styles_itemName__2Aoj9');
                const link_cost = document.querySelectorAll('.rupee');
                const foodTypes_nodes = document.querySelectorAll('.icon-foodSymbol')
                const item_cost = Array.from(link_cost).map(a => a.innerText);
                const foodTypes =  Array.from(foodTypes_nodes).map(a => {
                    return a.classList.contains('styles_iconVeg__shLxJ') ? 'veg' : 'non-veg'
                });
                const items = Array.from(links).map((a,index) => {
                    return {
                        name: a.innerText,
                        type: foodTypes[index],
                        price: item_cost[index]
                    }
                });

                return {title, categories, rating, location, city, items}
            })
            await browser.close();
            return {
                name: data.title,
                location: data.location,
                rating: data.rating,
                categories: data.categories,
                items: data.items,
                city: data.city,
            }
        } else if(getDomain(url) === 'zomato') {
            await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
            await page.goto(url,{waitUntil: 'domcontentloaded'});
            const preData = await page.evaluate(() => document.querySelector('*').outerHTML);
            console.log(preData);
            const data = await page.evaluate(() => {
                const title = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').innerText;
                const rating = document.querySelector('.lhdg1m-2').innerText;
                const category = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').parentElement.parentElement.children[1].children[0].textContent
                const city = document.querySelector('a.ks3f96-0:nth-child(3) > span:nth-child(1)').innerText.replace(/[^a-zA-Z ]/g, "")
                const location = document.querySelector('h1.sc-7kepeu-0:nth-child(1)').parentElement.parentElement.children[1].children[1].textContent
                const links = document.querySelectorAll('.sc-1s0saks-15');
                const cost_nodes = document.querySelectorAll('.cCiQWA');
                const costs = Array.from(cost_nodes).map(a => a.innerText);
                const food_type_ele = document.querySelectorAll('.sc-1tx3445-0')
                const items = Array.from(links).map(a => a.innerText);
                const food_types = Array.from(food_type_ele).map(a => a.getAttribute("type"));
                const menu = items.map((ele,index) => {
                    return {
                        name: ele,
                        type: food_types[index],
                        price: costs[index].replace('₹','')
                    }
                })
                return {title, rating, category, location, city, menu}
            })
            return {
                name: data.title,
                location: data.location,
                rating: data.rating,
                categories: data.category,
                items: data.menu,
                city: data.city,
            }
        } else {
            throw new Error('Not Valid Domain')
        }
    } catch (e) {
        console.log(e)
        return {
            error: 'Please Check link and Try Again'
        }
    }
}

module.exports = scrapRestaurant
