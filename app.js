var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var config = require('./config.js');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var _ = require('lodash');
// CONFIG DATABASE=====================================================
// mongoose.connect('mongodb://localhost/app_news');
mongoose.connect('mongodb://minhtringo141:minhtri@ds155130.mlab.com:55130/project_app_news');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));
db.once('open', function() {
    console.log('DB connection success! ');
});
var Item = require('./api/items/item.model');
var ItemByRegion = require('./api/items/itemByRegion.model');
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
setInterval(() => {
    async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
        request(itemCategory.url, { timeout: 3000 }, (err, response, body) => {
            if (!err && response.statusCode == 200 && body) {
                let $ = cheerio.load(body);
                var listItemLink = $('#col_1 #news_home li .block_image_news').toArray();
                async.eachSeries(listItemLink, (value, nextX) => {
                    if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH') {
                        var itemLink = value.children[1].children[0].next.attribs.href;
                        var imagesLinkList = new Array({ image: value.children[1].children[1].children[1].attribs.src, subTitleImage: "" });
                        // console.log(itemLink);
                    } else if (itemCategory.name == 'DU_LICH') {
                        var itemLink = value.children[1].children[0].next.attribs.href;
                        var imagesLinkList = new Array({ image: value.children[3].children[1].children[0].attribs.src, subTitleImage: "" });
                        // console.log(itemLink);
                    } else {
                        var itemLink = value.children[1].children[0].attribs.href;
                        var imagesLinkList = new Array({ image: value.children[3].children[0].next.children[0].attribs.src, subTitleImage: "" });
                        // console.log(itemLink);
                    }
                    if (itemLink.includes('video') || itemLink.includes('photo') || itemLink.includes('trac-nghiem')) {
                        console.log('Link contain video, can not crawled!');
                        nextX();
                    } else {
                        request(itemLink, { timeout: 3000 }, (err, response, body) => {
                            if (err || !body) {
                                nextX();
                            } else {
                                let $ = cheerio.load(body);
                                var content = $('.fck_detail p').text().split("\n\t");
                                $("#left_calculator .tplCaption tbody").each(function() {
                                    // if (this.children[0].children[0].children[1].attribs.src != undefined && this.children[1].children[0].children[1].children[0].data != undefined) {
                                    //     imagesLinkList.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data });
                                    // }
                                    try {
                                        imagesLinkList.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data });
                                    } catch (err) {
                                        console.log(err);
                                    }
                                });
                                var title = $(".main_content_detail .title_news").first().text();
                                var subTitle = $(".short_intro").text();
                                var uploadedTime = $(".block_timer_share .block_timer").text();
                                var relatedItemArray = new Array();
                                async.each($('.list_10tinkhac .left ul li h2 a:first-child'), (value, nextRelate) => {
                                    if (value.attribs.title != undefined) {
                                        var relatedItemTitle = value.attribs.title;
                                        var relatedItemLink = value.attribs.href;
                                        var relatedItemImageLink = new Array({});
                                        if (relatedItemLink.includes('video') || relatedItemLink.includes('photo') || relatedItemLink.includes('trac-nghiem')) {
                                            console.log('Link contain video, can not crawled !');
                                            nextRelate();
                                        } else {
                                            request(relatedItemLink, { timeout: 3000 }, (err, response, body) => {
                                                if (err || !body) {
                                                    nextRelate();
                                                } else {
                                                    let $ = cheerio.load(body);
                                                    var relatedItemContent = $('.fck_detail p').text().split("\n\t");
                                                    $("#left_calculator .tplCaption tbody").each(function() {
                                                        // if (this.children[0].children[0].children[1].attribs.src != undefined && this.children[1].children[0].children[1].children[0].data != undefined) {
                                                        //     relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                        // }
                                                        try {
                                                            relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                        } catch (err) {
                                                            console.log(err);
                                                        }
                                                    });
                                                    var relatedSubTitle = $(".short_intro").text();
                                                    var relatedUploadedTime = $(".block_timer_share .block_timer").text();
                                                    relatedItemContent.shift();
                                                    relatedItemImageLink.shift();
                                                    relatedItemArray.push({
                                                        itemLink: relatedItemLink,
                                                        imagesLinkList: relatedItemImageLink,
                                                        content: relatedItemContent,
                                                        title: relatedItemTitle,
                                                        subTitle: relatedSubTitle,
                                                        uploadedTime: relatedUploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                        sourceName: 'VNEXPRESS',
                                                        sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A'

                                                    });
                                                    nextRelate();
                                                }
                                            });
                                        }
                                    } else {
                                        nextRelate();
                                    }
                                }, function(err) {
                                    if (!err && relatedItemArray.length > 0) {
                                        console.log(relatedItemArray, '++++++++++++++++++++++++++++++++++++++')
                                        Item.findOne({ itemLink: itemLink, isHot: 0 }).exec(function(err, data) {
                                            if (data) {
                                                console.log("Already in database !!!");
                                                nextX();
                                            } else {
                                                content.shift();
                                                // imagesLinkList.shift();
                                                var newNews = {
                                                    itemLink: itemLink,
                                                    imagesLinkList: imagesLinkList,
                                                    content: content,
                                                    title: title.replace(/  /g, '').replace(/\r\n/g, ''),
                                                    subTitle: subTitle,
                                                    uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                    sourceName: 'VNEXPRESS',
                                                    sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
                                                    category: itemCategory.name,
                                                    isHot: 0,
                                                    relatedItemArray: relatedItemArray
                                                };
                                                Item.create(newNews, function(err, data) {
                                                    if (err) {
                                                        console.log("ERROR push into db !", err);
                                                        nextX();
                                                    } else {
                                                        console.log("Insert to database successfully !!!");
                                                        nextX();
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.log("Error request child");
                                        nextX();
                                    }
                                });
                            }
                        });
                    }
                });
                nextAsync();
            } else {
                console.log('Request error : ', err);
                nextAsync();
            }
        });
    });
}, 120000);


// VNEXPRESS HOT NEWS BY CATEGORY
setInterval(() => {
    async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
        request(itemCategory.url, { timeout: 3000 }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let $ = cheerio.load(body);
                var listItemLink = $('#box_news_top .box_sub_hot_news .content_scoller ul li').toArray();
                async.eachSeries(listItemLink, (value, nextX) => {
                    if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH' || itemCategory.name == 'DU_LICH' || itemCategory.name == 'SUC_KHOE') {
                        var imagesLinkList = new Array();
                        var itemLink = value.children[1].children[1].attribs.href
                    } else {
                        var imagesLinkList = new Array(value.children[3].children[1].children[0].attribs.src);
                        var itemLink = value.children[3].children[1].attribs.href;
                    }
                    if (itemLink.includes('video') || itemLink.includes('photo') || itemLink.includes('trac-nghiem')) {
                        console.log('Link contain video, can not crawled !');
                        nextX();
                    } else {
                        request(itemLink, { timeout: 3000 }, (err, response, body) => {
                            if (err || !body) {
                                nextX();
                            } else {
                                let $ = cheerio.load(body);
                                var content = $('.fck_detail p').text().split("\n\t");
                                $("#left_calculator .tplCaption tbody").each(function() {
                                    try {
                                        imagesLinkList.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data });
                                    } catch (err) {
                                        console.log(err);
                                    }
                                });
                                var title = $(".main_content_detail .title_news").first().text();
                                var subTitle = $(".short_intro").text();
                                var uploadedTime = $(".block_timer_share .block_timer").text();
                                var relatedItemArray = new Array();

                                async.each($('.list_10tinkhac .left ul li h2 a:first-child'), (value, nextRelate) => {
                                    if (value.attribs.title != undefined) {
                                        var relatedItemTitle = value.attribs.title;
                                        var relatedItemLink = value.attribs.href;
                                        var relatedItemImageLink = new Array({});
                                        if (relatedItemLink.includes('video') || relatedItemLink.includes('photo') || relatedItemLink.includes('trac-nghiem')) {
                                            console.log('Link contain video, can not crawled !');
                                            nextRelate();
                                        } else {
                                            request(relatedItemLink, { timeout: 3000 }, (err, response, body) => {
                                                if (err || !body) {
                                                    nextRelate();
                                                } else {
                                                    let $ = cheerio.load(body);
                                                    var relatedItemContent = $('.fck_detail p').text().split("\n\t");
                                                    $("#left_calculator .tplCaption tbody").each(function() {
                                                        // if (this.children[0].children[0].children[1].attribs.src != undefined && this.children[1].children[0].children[1].children[0].data != undefined) {
                                                        //     relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                        // }
                                                        try {
                                                            relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                        } catch (err) {
                                                            console.log(err);
                                                        }
                                                    });
                                                    var relatedSubTitle = $(".short_intro").text();
                                                    var relatedUploadedTime = $(".block_timer_share .block_timer").text();
                                                    relatedItemContent.shift();
                                                    relatedItemImageLink.shift();
                                                    relatedItemArray.push({
                                                        itemLink: relatedItemLink,
                                                        imagesLinkList: relatedItemImageLink,
                                                        content: relatedItemContent,
                                                        title: relatedItemTitle,
                                                        subTitle: relatedSubTitle,
                                                        uploadedTime: relatedUploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                        sourceName: 'VNEXPRESS',
                                                        sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A'

                                                    });
                                                    nextRelate();
                                                }
                                            });
                                        }
                                    } else {
                                        nextRelate();
                                    }
                                }, function(err) {
                                    if (!err && relatedItemArray.length > 0) {
                                        console.log(relatedItemArray, '++++++++++++++++++++++++++++++++++++++')
                                        Item.findOne({ itemLink: itemLink, isHot: 1 }).exec(function(err, data) {
                                            if (data) {
                                                console.log("Already in database !!!");
                                                nextX();
                                            } else {
                                                content.shift();
                                                // imagesLinkList.shift();
                                                var newNews = {
                                                    itemLink: itemLink,
                                                    imagesLinkList: imagesLinkList,
                                                    content: content,
                                                    title: title.replace(/  /g, '').replace(/\r\n/g, ''),
                                                    subTitle: subTitle,
                                                    uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                    sourceName: 'VNEXPRESS',
                                                    sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
                                                    category: itemCategory.name,
                                                    isHot: 1,
                                                    relatedItemArray: relatedItemArray
                                                };
                                                Item.create(newNews, function(err, data) {
                                                    if (err) {
                                                        console.log("ERROR push into db !", err);
                                                        nextX();
                                                    } else {
                                                        console.log("Insert to database successfully !!!");
                                                        nextX();
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.log("Error request child");
                                        nextX();
                                    }
                                });
                            }

                        });
                    }
                })
                nextAsync();
            } else {
                console.log('Request error : ', err);
                nextAsync();
            }

        });
    });
}, 120000);

// // request('http://news.zing.vn/thoi-su.html', { timeout: 1500 }, (err, response, body) => {
// //     if (!err && response.statusCode == 200) {
// //         let $ = cheerio.load(body);
// //         var listItemLink = $('.cate_content article').toArray();
// //         async.eachSeries(listItemLink, (value, next) => {
// //             var imagesLinkList = [];
// //             var itemLink = 'http://news.zing.vn/' + value.children[3].children[1].attribs.href;
// //             imagesLinkList.push(value.children[3].children[1].children[1].attribs.src);
// //             console.log(value.children[3].children[1].children[1].attribs.src, "-------------------------------------- \n");
// //             next();
// //         })
// //     } else {
// //         console.log('Request error : ', err);
// //     }
// // })


// // GET HOTTEST NEWS
setInterval(() => {
    request('http://vnexpress.net', { timeout: 3000 }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let $ = cheerio.load(body);
            var listItemLink = $('#box_news_top .box_sub_hot_news .content_scoller ul li').toArray();
            async.eachSeries(listItemLink, (value, nextX) => {
                var imagesLinkList = new Array({});
                var itemLink = value.children[1].children[0].attribs.href;
                if (itemLink.includes('video') || itemLink.includes('photo') || itemLink.includes('trac-nghiem')) {
                    console.log('Link contain video, can not crawled HOMEPAGE!');
                    nextX();
                } else {
                    console.log(itemLink)
                    request(itemLink, { timeout: 3000 }, (err, response, body) => {
                        if (err || !body) {
                            nextX();
                        } else {
                            let $ = cheerio.load(body);
                            var content = $('.fck_detail p').text().split("\n\t");
                            $("#left_calculator .tplCaption tbody").each(function() {
                                try {
                                    imagesLinkList.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data });
                                } catch (err) {
                                    console.log(err);
                                }
                            });
                            var title = $(".main_content_detail .title_news").first().text();
                            var subTitle = $(".short_intro").text();
                            var uploadedTime = $(".block_timer_share .block_timer").text();
                            var relatedItemArray = new Array();
                            async.each($('.list_10tinkhac .left ul li h2 a:first-child'), (value, nextRelate) => {
                                if (value.attribs.title != undefined) {
                                    var relatedItemTitle = value.attribs.title;
                                    var relatedItemLink = value.attribs.href;
                                    var relatedItemImageLink = new Array({});
                                    if (relatedItemLink.includes('video') || relatedItemLink.includes('photo') || relatedItemLink.includes('trac-nghiem')) {
                                        console.log('Link contain video, can not crawled !');
                                        nextRelate();
                                    } else {
                                        request(relatedItemLink, { timeout: 3000 }, (err, response, body) => {
                                            if (err || !body) {
                                                nextRelate();
                                            } else {
                                                let $ = cheerio.load(body);
                                                var relatedItemContent = $('.fck_detail p').text().split("\n\t");
                                                $("#left_calculator .tplCaption tbody").each(function() {
                                                    // if (this.children[0].children[0].children[1].attribs.src != undefined && this.children[1].children[0].children[1].children[0].data != undefined) {
                                                    //     relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                    // }
                                                    try {
                                                        relatedItemImageLink.push({ image: this.children[0].children[0].children[1].attribs.src, subTitleImage: this.children[1].children[0].children[1].children[0].data.replace(/\n\t\t\t\t\t/, '') });
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                });
                                                var relatedSubTitle = $(".short_intro").text();
                                                var relatedUploadedTime = $(".block_timer_share .block_timer").text();
                                                relatedItemContent.shift();
                                                relatedItemImageLink.shift();
                                                relatedItemArray.push({
                                                    itemLink: relatedItemLink,
                                                    imagesLinkList: relatedItemImageLink,
                                                    content: relatedItemContent,
                                                    title: relatedItemTitle,
                                                    subTitle: relatedSubTitle,
                                                    uploadedTime: relatedUploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                    sourceName: 'VNEXPRESS',
                                                    sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A'
                                                });
                                                console.log(relatedItemArray);
                                                nextRelate();
                                            }
                                        });
                                    }
                                } else {
                                    nextRelate();
                                }
                            }, function(err) {
                                if (!err && relatedItemArray.length > 0) {
                                    Item.findOne({ itemLink: itemLink, isHot: 2 }).exec(function(err, data) {
                                        if (data) {
                                            console.log("Already in database !!!");
                                            nextX();
                                        } else {
                                            content.shift();
                                            imagesLinkList.shift();
                                            var newNews = {
                                                itemLink: itemLink,
                                                imagesLinkList: imagesLinkList,
                                                content: content,
                                                title: title.replace(/  /g, '').replace(/\r\n/g, ''),
                                                subTitle: subTitle,
                                                uploadedTime: uploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace(" GMT+7", '').replace(" |", ','),
                                                sourceName: 'VNEXPRESS',
                                                sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
                                                category: "HOMEPAGE",
                                                isHot: 2,
                                                relatedItemArray: relatedItemArray
                                            };
                                            Item.create(newNews, function(err, data) {
                                                if (err) {
                                                    console.log("ERROR push into db !", err);
                                                    nextX();
                                                } else {
                                                    console.log("Insert to database successfully !!!");
                                                    nextX();
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log("Error request child");
                                    nextX();
                                }
                            });
                        }

                    });
                }
            })
        } else {
            console.log('Request error : ', err);
        }
    });
}, 120000);

setInterval(() => {
    async.eachSeries(config.BAO24H, (itemCategory, nextAsync, cb) => {
        request(itemCategory.url, { timeout: 3000 }, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let $ = cheerio.load(body);
                var listItemLink = $('.boxDoi-sub-Item-trangtrong').toArray();
                listItemLink = listItemLink.slice(0, listItemLink.length - 4);
                async.eachSeries(listItemLink, (value, nextX) => {
                    var itemLink = "http://www.24h.com.vn" + value.children[1].children[0].attribs.href;
                    var imagesLinkList = new Array({ image: value.children[1].children[0].children[0].attribs.src, subTitleImage: value.children[1].children[0].children[0].attribs.alt });
                    var title = value.children[1].children[0].attribs.title;
                    var content = new Array();
                    if (itemLink == undefined || title == undefined) {
                        nextX();
                    } else {
                        request(itemLink, { timeout: 3000 }, (err, response, body) => {
                            if (err || !body) {
                                nextX();
                            } else {
                                let $ = cheerio.load(body);
                                var title = $('.baiviet-title').text();
                                var subTitle = $('.baiviet-sapo').text().replace(/\t/g, '').replace(/\r\n/g, '');
                                $('.text-conent>p').each(function() {
                                    if (this.children.length > 0) {
                                        if (this.children[0].type == 'text' && _.isEmpty(this.children[0].parent.attribs)) {
                                            content.push(this.children[0].data);
                                        }
                                    }
                                });
                                var uploadedTime = $('.baiviet-ngay').text();
                                $('.news-image').each(function() {
                                    imagesLinkList.push({ image: this.attribs.src, subTitleImage: this.attribs.alt });
                                });
                                var relatedItemArray = new Array();
                                async.each($('.baiviet-bailienquan .bailienquan-trangtrong span:first-child'), (value, nextRelate) => {
                                    if (value.children[0].attribs.title != undefined) {
                                        var relatedItemTitle = value.children[0].attribs.title;
                                        var relatedItemLink = value.children[0].attribs.href;
                                        var relatedItemImageLink = new Array({ image: value.children[0].children[1].src, subTitleImage: value.children[0].children[1].alt });
                                        var relatedItemContent = new Array();
                                        request(relatedItemLink, { timeout: 3000 }, (err, response, body) => {

                                            if (err || !body) {
                                                nextRelate();
                                            } else {
                                                let $ = cheerio.load(body);
                                                $('.text-conent>p').each(function() {
                                                    if (this.children.length > 0) {
                                                        if (this.children[0].type == 'text' && _.isEmpty(this.children[0].parent.attribs)) {
                                                            relatedItemContent.push(this.children[0].data);
                                                        }
                                                    }
                                                });
                                                var relatedUploadedTime = $('.baiviet-ngay').text();
                                                $('.news-image').each(function() {
                                                    relatedItemImageLink.push({ image: this.attribs.src, subTitleImage: this.attribs.alt });
                                                });
                                                var relatedSubTitle = $('.baiviet-sapo').text().replace(/\t/g, '').replace(/\r\n/g, '');
                                                relatedItemImageLink.shift();
                                                relatedItemArray.push({
                                                    itemLink: relatedItemLink,
                                                    imagesLinkList: relatedItemImageLink,
                                                    content: relatedItemContent,
                                                    title: relatedItemTitle,
                                                    subTitle: relatedSubTitle,
                                                    uploadedTime: relatedUploadedTime.replace(/  /g, '').replace(/\r\n/g, '').replace(/\t/g, '').replace("(GMT+7)", '').replace(" AM ", '').replace("ngày ", '').replace(" PM ", ''),
                                                    sourceName: '24H',
                                                    sourceIconLink: 'http://cdn.marketplaceimages.windowsphone.com/v8/images/d2f1875a-bc7e-462f-97ed-1def619bb70b?imageType=ws_icon_medium',
                                                    category: "NEWSBYREGION",
                                                    isHot: 3,
                                                    region: itemCategory.name
                                                });
                                                nextRelate();
                                            }
                                        });
                                    } else {
                                        nextRelate();
                                    }
                                }, function(err) {
                                    if (!err && relatedItemArray.length > 0) {
                                        ItemByRegion.findOne({ itemLink: itemLink }).exec(function(err, data) {
                                            if (data) {
                                                console.log("Already in database !!!");
                                                nextX();
                                            } else {
                                                var newNews = {
                                                    itemLink: itemLink,
                                                    imagesLinkList: imagesLinkList,
                                                    content: content,
                                                    title: title,
                                                    subTitle: subTitle,
                                                    uploadedTime: uploadedTime.replace("(GMT+7)", '').replace(" AM ", '').replace("ngày ", '').replace(" PM ", ''),
                                                    sourceName: '24H',
                                                    sourceIconLink: 'http://cdn.marketplaceimages.windowsphone.com/v8/images/d2f1875a-bc7e-462f-97ed-1def619bb70b?imageType=ws_icon_medium',
                                                    category: "NEWSBYREGION",
                                                    isHot: 3,
                                                    region: itemCategory.name,
                                                    relatedItemArray: relatedItemArray
                                                }
                                                ItemByRegion.create(newNews, function(err, data) {
                                                    if (err) {
                                                        console.log("ERROR push into db !", err);
                                                        nextX();
                                                    } else {
                                                        console.log("Insert to database successfully !!!");
                                                        nextX();
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.log("Error request child");
                                        nextX();
                                    }
                                });
                            }
                        });
                    }
                });
                nextAsync();
            } else {
                console.log('Request error : ', err);
                nextAsync();
            }

        });
    });
}, 120000);