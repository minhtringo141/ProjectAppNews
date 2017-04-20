var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var config = require('./config.js');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
// CONFIG DATABASE=====================================================
mongoose.connect('mongodb://localhost/app_news');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));
db.once('open', function() {
    console.log('DB connection success! ');
});
var Item = require('./api/items/items.model');
var ItemsHot = require('./api/items/itemsHot.model');
// ====================================================================
var cb = function() {
    console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
}

var app = express();
var server = http.createServer(app);
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.render('index');
})

app.use('/api', require('./api/items'));
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));
module.exports = app;

// VNEXPRESS ITEM NEWS CRAWLER
// setInterval(() => {
//     async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
//         request(itemCategory.url, { timeout: 1500 }, (err, response, body) => {
//             if (!err && response.statusCode == 200 && body) {
//                 let $ = cheerio.load(body);
//                 var listItemLink = $('#col_1 #news_home li .block_image_news').toArray();
//                 async.eachSeries(listItemLink, (value, next) => {
//                     if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH') {
//                         var itemLink = value.children[1].children[0].next.attribs.href;
//                         var imagesLinkList = new Array(value.children[1].children[1].children[1].attribs.src);
//                         console.log(itemLink);
//                     } else if (itemCategory.name == 'DU_LICH') {
//                         var itemLink = value.children[1].children[0].next.attribs.href;
//                         var imagesLinkList = new Array(value.children[3].children[1].children[0].attribs.src);
//                         console.log(itemLink);
//                     } else {
//                         var itemLink = value.children[1].children[0].attribs.href;
//                         var imagesLinkList = new Array(value.children[3].children[0].next.children[0].attribs.src);
//                         console.log(itemLink);
//                     }
//                     if (itemLink.includes('video')) {
//                         console.log('Link contain video, can not crawled!');
//                         next();
//                     } else {
//                         request(itemLink, { timeout: 1500 }, (err, response, body) => {
//                             if (err || !body) {
//                                 next();
//                             } else {
//                                 let $ = cheerio.load(body);
//                                 var content = $('.fck_detail p').text().split("\n\t");
//                                 $("#left_calculator .tplCaption tbody tr td img").each(function() {
//                                     imagesLinkList.push(this.attribs.src);
//                                 });
//                                 var title = $(".main_content_detail .title_news").first().text();
//                                 var subTitle = $(".short_intro").text();
//                                 var uploadedTime = $(".block_timer_share .block_timer").text();

//                                 Item.findOne({ itemLink: itemLink }).exec(function(err, data) {
//                                     if (data) {
//                                         console.log("Already in database !!!");
//                                         next();
//                                     } else {
//                                         var newNews = {
//                                             itemLink: itemLink,
//                                             imagesLinkList: imagesLinkList,
//                                             content: content,
//                                             title: title.replace(/  /g, '').replace(/\r\n/g, ''),
//                                             subTitle: subTitle,
//                                             uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, ''),
//                                             sourceName: 'VNEXPRESS',
//                                             sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
//                                             category: itemCategory.name,
//                                             isHot: 0
//                                         };
//                                         Item.create(newNews, function(err, data) {
//                                             if (err) {
//                                                 console.log("ERROR push into db !", err);
//                                                 next();
//                                             } else {
//                                                 console.log("Insert to database successfully !!!");
//                                                 next();
//                                             }
//                                         });
//                                     }
//                                 });
//                             }

//                         });
//                     }
//                 });
//             } else {
//                 console.log('Request error : ', err);
//             }
//             nextAsync();
//         });
//     });
// }, 3600000);


// VNEXPRESS HOT NEWS BY CATEGORY
// setInterval(() => {
//     async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
//         request(itemCategory.url, { timeout: 3000 }, (err, response, body) => {
//             if (!err && response.statusCode == 200) {
//                 let $ = cheerio.load(body);
//                 var listItemLink = $('#box_news_top .box_sub_hot_news .content_scoller ul li').toArray();
//                 async.eachSeries(listItemLink, (value, next) => {
//                     if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH' || itemCategory.name == 'DU_LICH' || itemCategory.name == 'SUC_KHOE') {
//                         var imagesLinkList = new Array();
//                         var itemLink = value.children[1].children[1].attribs.href
//                     } else {
//                         var imagesLinkList = new Array(value.children[3].children[1].children[0].attribs.src);
//                         var itemLink = value.children[3].children[1].attribs.href;
//                     }
//                     if (itemLink.includes('video')) {
//                         console.log('Link contain video, can not crawled !');
//                         next();
//                     } else {
//                         request(itemLink, { timeout: 3000 }, (err, response, body) => {
//                             if (err || !body) {
//                                 next();
//                             } else {
//                                 let $ = cheerio.load(body);
//                                 var content = $('#left_calculator .Normal').text().split("\n\t");
//                                 $("#left_calculator .tplCaption tbody tr td img").each(function() {
//                                     imagesLinkList.push(this.attribs.src);
//                                 });
//                                 var title = $(".main_content_detail .title_news").first().text();
//                                 var subTitle = $(".short_intro").text();
//                                 var uploadedTime = $(".block_timer_share .block_timer").text();

//                                 Item.findOne({ itemLink: itemLink }).exec(function(err, data) {
//                                     if (data) {
//                                         console.log("Already in database !!!");
//                                         next();
//                                     } else {
//                                         var newNews = {
//                                             itemLink: itemLink,
//                                             imagesLinkList: imagesLinkList,
//                                             content: content,
//                                             title: title.replace(/  /g, '').replace(/\r\n/g, ''),
//                                             subTitle: subTitle,
//                                             uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, ''),
//                                             sourceName: 'VNEXPRESS',
//                                             sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
//                                             category: itemCategory.name,
//                                             isHot: 1
//                                         }
//                                         Item.create(newNews, function(err, data) {
//                                             if (err) {
//                                                 console.log("ERROR push into db !", err);
//                                                 next();
//                                             } else {
//                                                 console.log("Insert to database successfully !!!");
//                                                 next();
//                                             }
//                                         });
//                                     }
//                                 });
//                             }

//                         });
//                     }
//                 })
//             } else {
//                 console.log('Request error : ', err);
//             }
//             nextAsync();
//         });
//     });
// }, 3600000);

// request('http://news.zing.vn/thoi-su.html', { timeout: 1500 }, (err, response, body) => {
//     if (!err && response.statusCode == 200) {
//         let $ = cheerio.load(body);
//         var listItemLink = $('.cate_content article').toArray();
//         async.eachSeries(listItemLink, (value, next) => {
//             var imagesLinkList = [];
//             var itemLink = 'http://news.zing.vn/' + value.children[3].children[1].attribs.href;
//             imagesLinkList.push(value.children[3].children[1].children[1].attribs.src);
//             console.log(value.children[3].children[1].children[1].attribs.src, "-------------------------------------- \n");
//             next();
//         })
//     } else {
//         console.log('Request error : ', err);
//     }
// })


// GET HOTTEST NEWS
// setInterval(() => {
//     request('http://vnexpress.net', { timeout: 3000 }, (err, response, body) => {
//         if (!err && response.statusCode == 200) {
//             let $ = cheerio.load(body);
//             var listItemLink = $('#box_news_top .box_sub_hot_news .content_scoller ul li').toArray();
//             async.eachSeries(listItemLink, (value, next) => {
//                 var imagesLinkList = new Array();
//                 var itemLink = value.children[1].children[0].attribs.href;
//                 if (itemLink.includes('video')) {
//                     console.log('Link contain video, can not crawled !');
//                     next();
//                 } else {
//                     request(itemLink, { timeout: 3000 }, (err, response, body) => {
//                         if (err || !body) {
//                             next();
//                         } else {
//                             let $ = cheerio.load(body);
//                             var content = $('#left_calculator .Normal').text().split("\n\t");
//                             $("#left_calculator .tplCaption tbody tr td img").each(function() {
//                                 imagesLinkList.push(this.attribs.src);
//                             });
//                             var title = $(".main_content_detail .title_news").first().text();
//                             var subTitle = $(".short_intro").text();
//                             var uploadedTime = $(".block_timer_share .block_timer").text();
//                             console.log(itemLink);
//                             Item.findOne({ itemLink: itemLink }).exec(function(err, data) {
//                                 if (data) {
//                                     console.log("Already in database !!!");
//                                     next();
//                                 } else {
//                                     var newNews = {
//                                         itemLink: itemLink,
//                                         imagesLinkList: imagesLinkList,
//                                         content: content,
//                                         title: title.replace(/  /g, '').replace(/\r\n/g, ''),
//                                         subTitle: subTitle,
//                                         uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, ''),
//                                         sourceName: 'VNEXPRESS',
//                                         sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
//                                         category: "HOMEPAGE",
//                                         isHot: 3
//                                     }
//                                     Item.create(newNews, function(err, data) {
//                                         if (err) {
//                                             console.log("ERROR push into db !", err);
//                                             next();
//                                         } else {
//                                             console.log("Insert to database successfully !!!");
//                                             next();
//                                         }
//                                     });
//                                 }

//                             });
//                         }

//                     });
//                 }
//             })
//         } else {
//             console.log('Request error : ', err);
//         }
//     });
// }, 3600000);



request('http://www.24h.com.vn/tin-ha-noi-c414.html', { timeout: 3000 }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        let $ = cheerio.load(body);
        var listItemLink = $('.boxDoi-sub-Item-trangtrong').toArray();
        listItemLink.slice(0, listItemLink.length - 4);
        async.eachSeries(listItemLink, (value, next) => {
            var itemLink = "http://www.24h.com.vn" + value.children[1].children[0].attribs.href;
            var title = value.children[1].children[0].attribs.title;
            console.log(itemLink, title);
            next();
        });
    }
})