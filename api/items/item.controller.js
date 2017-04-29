'use strict';
var _ = require('lodash');
var Item = require('./item.model');
var itemByRegion = require('./itemByRegion.model');
var SavedItem = require('./savedItem.model');
var Favourite = require('./favourite.model');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    findAllNews: function(req, res) {
        Item.find({ isHot: 0 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotNews: function(req, res) {
        Item.find({ isHot: 1 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotestNews: function(req, res) {
        Item.find({ isHot: 2 }).sort('createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    homepage: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: {
                hotNews: [],
                highlights: [],
                newsByRegion: []
            }
        };
        Item.find({ isHot: 1, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.hotNews = data;
            Item.find({ isHot: 2, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
                if (err) {
                    console.log('Error in get all from database', err);
                    res.send(err);
                }
                dataHomepage.data.highlights = data;
                itemByRegion.find({ content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
                    if (err) {
                        console.log('Error in get all from database', err);
                        res.send(err);
                    }
                    dataHomepage.data.newsByRegion = data;
                    res.json(dataHomepage);
                });
            });
        });
    },
    findByCategory: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        Item.find({ category: req.params.name, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data = dataR;
            res.json(dataHomepage);
        });
    },
    findByRegion: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        itemByRegion.find({ region: req.params.name, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data = dataR;
            res.json(dataHomepage);
        });
    },
    // LIST CATEGORY
    listCategory: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: [{
                    category: "THỜI SỰ",
                    image: "http://media.phunutoday.vn/files/upload_images/2016/06/10/lich-phat-song-chung-trinhh-truyen-hinh-ngay-11-6-2016_phunutoday_vn%201.jpg"
                },
                {
                    category: "THẾ GIỚI",
                    image: "https://img.clipartfest.com/540e37c249524d2a300f2c6a9b0c7e82_breaking-news-world-news-free-world-news-clipart_1300-831.jpeg"
                },
                {
                    category: "KINH DOANH",
                    image: "http://study.com/cimages/course-image/praxis-ii-business-education-test_118084_large.jpg"
                },
                {
                    category: "GIẢI TRÍ",
                    image: "https://s4.scoopwhoop.com/v4/category/entertainment.png"
                },
                {
                    category: "THỂ THAO",
                    image: "http://www.teamworkonline.com/network/assets/imgs/mobile_bg_1.jpg"
                },
                {
                    category: "PHÁP LUẬT",
                    image: "http://www.openaccesslawcanada.ca/lawpic1.jpg"
                },
                {
                    category: "GIÁO DỤC",
                    image: "https://emmer.house.gov/sites/emmer.house.gov/files/styles/congress_featured_image/public/featured_image/issues/Education-OpportunitySmall.jpg"
                },
                {
                    category: "SỨC KHOẺ",
                    image: "http://ormeaumedical.com.au/wp-content/uploads/2013/03/pic3.jpg"
                },
                {
                    category: "GIA ĐÌNH",
                    image: "http://weknowyourdreams.com/images/family/family-07.jpg"
                },
                {
                    category: "DU LỊCH",
                    image: "https://blogs-images.forbes.com/robertadams/files/2016/03/the-best-travel-websites-in-the-world-1200x800.jpg?width=960"
                },
                {
                    category: "KHOA HỌC",
                    image: "http://www.scienceprofessionals.co.uk/wp-content/uploads/2016/08/life-science.jpg"
                },
                {
                    category: "SỐ HOÁ",
                    image: "http://www.rhiredstaffing.com/wp-content/uploads/2014/11/ict.jpg"
                },
                {
                    category: "CỘNG ĐỒNG",
                    image: "http://s7d5.scene7.com/is/image/ni/iStock_000048642816_Full_16x9?$ni-card-md$&fit=crop"
                },
                {
                    category: "TÂM SỰ",
                    image: "https://s-media-cache-ak0.pinimg.com/originals/48/44/b1/4844b1ec5e4100c4106127c8f67ef7a9.jpg"
                }
            ]

        };
        res.json(dataHomepage);
        // Item.find({ category: "THOI_SU", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //     if (err) {
        //         console.log('Error in get all from database', err);
        //         res.send(err);
        //     }
        //     dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //     var temp = {
        //         "category": "THỜI SỰ",
        //         "image": dataR[0].imagesLinkList[0],
        //     }
        //     dataHomepage.data.push(temp);
        //     Item.find({ category: "THE_GIOI", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //         if (err) {
        //             console.log('Error in get all from database', err);
        //             res.send(err);
        //         }
        //         dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //         var temp = {
        //             "category": "THẾ GIỚI",
        //             "image": dataR[0].imagesLinkList[0],
        //         }
        //         dataHomepage.data.push(temp);
        //         Item.find({ category: "KINH_DOANH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //             if (err) {
        //                 console.log('Error in get all from database', err);
        //                 res.send(err);
        //             }
        //             dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //             var temp = {
        //                 "category": "KINH DOANH",
        //                 "image": dataR[0].imagesLinkList[0],
        //             }
        //             dataHomepage.data.push(temp);
        //             Item.find({ category: "GIAI_TRI", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                 if (err) {
        //                     console.log('Error in get all from database', err);
        //                     res.send(err);
        //                 }
        //                 dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                 var temp = {
        //                     "category": "GIẢI TRÍ",
        //                     "image": dataR[0].imagesLinkList[0],
        //                 }
        //                 dataHomepage.data.push(temp);
        //                 Item.find({ category: "THE_THAO", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                     if (err) {
        //                         console.log('Error in get all from database', err);
        //                         res.send(err);
        //                     }
        //                     dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                     var temp = {
        //                         "category": "THỂ THAO",
        //                         "image": dataR[0].imagesLinkList[0],
        //                     }
        //                     dataHomepage.data.push(temp);
        //                     Item.find({ category: "PHAP_LUAT", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                         if (err) {
        //                             console.log('Error in get all from database', err);
        //                             res.send(err);
        //                         }
        //                         dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                         var temp = {
        //                             "category": "PHÁP LUẬT",
        //                             "image": dataR[0].imagesLinkList[0],
        //                         }
        //                         dataHomepage.data.push(temp);
        //                         Item.find({ category: "GIAO_DUC", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                             if (err) {
        //                                 console.log('Error in get all from database', err);
        //                                 res.send(err);
        //                             }
        //                             dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                             var temp = {
        //                                 "category": "GIAO_DUC",
        //                                 "image": dataR[0].imagesLinkList[0],
        //                             }
        //                             dataHomepage.data.push(temp);
        //                             Item.find({ category: "SUC_KHOE", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                 if (err) {
        //                                     console.log('Error in get all from database', err);
        //                                     res.send(err);
        //                                 }
        //                                 dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                 var temp = {
        //                                     "category": "SUC_KHOE",
        //                                     "image": dataR[0].imagesLinkList[0],
        //                                 }
        //                                 dataHomepage.data.push(temp);
        //                                 Item.find({ category: "GIA_DINH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                     if (err) {
        //                                         console.log('Error in get all from database', err);
        //                                         res.send(err);
        //                                     }
        //                                     dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                     var temp = {
        //                                         "category": "GIA_DINH",
        //                                         "image": dataR[0].imagesLinkList[0],
        //                                     }
        //                                     dataHomepage.data.push(temp);
        //                                     Item.find({ category: "DU_LICH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                         if (err) {
        //                                             console.log('Error in get all from database', err);
        //                                             res.send(err);
        //                                         }
        //                                         dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                         var temp = {
        //                                             "category": "DU_LICH",
        //                                             "image": dataR[0].imagesLinkList[0],
        //                                         }
        //                                         dataHomepage.data.push(temp);
        //                                         Item.find({ category: "KHOA_HOC", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                             if (err) {
        //                                                 console.log('Error in get all from database', err);
        //                                                 res.send(err);
        //                                             }
        //                                             dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                             var temp = {
        //                                                 "category": "KHOA_HOC",
        //                                                 "image": dataR[0].imagesLinkList[0],
        //                                             }
        //                                             dataHomepage.data.push(temp);
        //                                             Item.find({ category: "SO_HOA", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                                 if (err) {
        //                                                     console.log('Error in get all from database', err);
        //                                                     res.send(err);
        //                                                 }
        //                                                 dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                                 var temp = {
        //                                                     "category": "SO_HOA",
        //                                                     "image": dataR[0].imagesLinkList[0],
        //                                                 }
        //                                                 dataHomepage.data.push(temp);
        //                                                 Item.find({ category: "CONG_DONG", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                                     if (err) {
        //                                                         console.log('Error in get all from database', err);
        //                                                         res.send(err);
        //                                                     }
        //                                                     dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                                     var temp = {
        //                                                         "category": "CONG_DONG",
        //                                                         "image": dataR[0].imagesLinkList[0],
        //                                                     }
        //                                                     dataHomepage.data.push(temp);
        //                                                     Item.find({ category: "TAM_SU", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
        //                                                         if (err) {
        //                                                             console.log('Error in get all from database', err);
        //                                                             res.send(err);
        //                                                         }
        //                                                         dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
        //                                                         var temp = {
        //                                                             "category": "TAM_SU",
        //                                                             "image": dataR[0].imagesLinkList[0],
        //                                                         }
        //                                                         dataHomepage.data.push(temp);
        //                                                         res.json(dataHomepage);
        //                                                     });
        //                                                 });
        //                                             });
        //                                         });
        //                                     });
        //                                 });
        //                             });
        //                         });
        //                     });
        //                 });
        //             });
        //         });
        //     });
        // });
    },
    postSavedItem: function(req, res) {
        if (req.body) {
            SavedItem.findOne({ itemId: req.body.id }).exec(function(err, data) {
                if (data) {
                    res.json({ status: false, message: 'User are already exist!' })
                } else {
                    var myObjectId = new ObjectId(req.body.id);
                    Item.findOne({ _id: myObjectId }).exec(function(err, data) {
                        if (_.isEmpty(data)) {
                            itemByRegion.findOne({ _id: myObjectId }).exec(function(err, data) {
                                if (_.isEmpty(data)) {
                                    res.json({ status: false, message: 'Error in ID' });
                                } else {
                                    data.isReadlater = 1;
                                    data.save(function(err, newData) {
                                        if (err) {
                                            console.log('Save item isReadlater err', err);
                                            res.json({ status: false, message: 'Error in save data' });
                                        } else {
                                            console.log('Save item isReadlater successfully');
                                            var newItem = {
                                                item: newData,
                                                itemId: req.body.id
                                            }
                                            SavedItem.create(newItem, function(err, data) {
                                                res.json({ status: true, message: 'Success' });
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            data.isReadlater = 1;
                            data.save(function(err, newData) {
                                if (err) {
                                    console.log('Save item isReadlater err', err);
                                    res.json({ status: false, message: 'Error in save data' });
                                } else {
                                    console.log('Save item isReadlater successfully');
                                    var newItem = {
                                        item: newData,
                                        itemId: req.body.id
                                    }
                                    SavedItem.create(newItem, function(err, data) {
                                        res.json({ status: true, message: 'Success' });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    getSavedItem: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        SavedItem.find().exec(function(err, data) {
            if (data) {
                if (_.isEmpty(data)) {
                    dataHomepage.status = 0;
                    res.json(dataHomepage);
                } else {
                    for (var i = 0; i < data.length; i++) {
                        dataHomepage.data.push(data[i].item);
                    }
                    res.json(dataHomepage);
                }
            } else {
                res.json({ error: "Not found" });
            }
        });
    },
    deleteSavedItem: function(req, res) {
        SavedItem.remove({ itemId: req.body.id }).exec(function(err, data) {
            var myObjectId = new ObjectId(req.body.id);
            Item.findOne({ _id: myObjectId }).exec(function(err, data) {
                if (_.isEmpty(data)) {
                    itemByRegion.findOne({ _id: myObjectId }).exec(function(err, data) {
                        if (_.isEmpty(data)) {
                            res.json({ status: false, message: 'Id not exist ' });
                        } else {
                            data.isReadlater = 0;
                            data.save(function(err, newData) {
                                if (err) {
                                    console.log('Save item isReadlater err', err);
                                    res.json({ status: false, message: 'Error in save data' });
                                } else {
                                    res.json({ status: true, message: 'Delete ok' });
                                }
                            });
                        }
                    });
                } else {
                    data.isReadlater = 0;
                    data.save(function(err, newData) {
                        if (err) {
                            console.log('Save item isReadlater err', err);
                            res.json({ status: false, message: 'Error in save data' });
                        } else {
                            res.json({ status: true, message: 'Delete ok' });
                        }
                    });
                }
            });
        });
    },
    postFavourite: function(req, res) {
        if (req.body) {
            Favourite.findOne({ category: req.body.name }).exec(function(err, data) {
                if (data) {
                    res.json({ status: false, message: 'User are already exist!' })
                } else {
                    var newItem = {
                        category: req.body.name
                    }
                    Favourite.create(newItem, function(err, data) {
                        res.json({ status: true, message: 'Success' });
                    });
                }
            });
        }
    },
    getFavourite: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        Favourite.find().exec(function(err, data) {
            if (_.isEmpty(data)) {
                dataHomepage.status = 0;
                res.json(dataHomepage);
            } else {
                for (var i = 0; i < data.length; i++) {
                    dataHomepage.data.push(data[i].category);
                }
                res.json(dataHomepage);
            }
        });
    },
    deleteFavourite: function(req, res) {
        Favourite.remove({ category: req.body.name }).exec(function(err, data) {
            if (err || data.length < 1) {
                res.json({ status: false, message: 'Not found' })
            } else if (data) {
                res.json({ status: true, message: 'Success' });
            }
        });
    }
}