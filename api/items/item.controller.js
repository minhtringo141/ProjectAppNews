'use strict';
var _ = require('lodash');
var Item = require('./item.model');
var itemByRegion = require('./itemByRegion.model');
var SavedItem = require('./savedItem.model');
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
            data: []
        };
        Item.find({ category: "THOI_SU", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
            var temp = {
                "category": "THOI_SU",
                "image": dataR[0].imagesLinkList[0],
            }
            dataHomepage.data.push(temp);
            Item.find({ category: "THE_GIOI", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                if (err) {
                    console.log('Error in get all from database', err);
                    res.send(err);
                }
                dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                var temp = {
                    "category": "THE_GIOI",
                    "image": dataR[0].imagesLinkList[0],
                }
                dataHomepage.data.push(temp);
                Item.find({ category: "THE_GIOI", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                    if (err) {
                        console.log('Error in get all from database', err);
                        res.send(err);
                    }
                    dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                    var temp = {
                        "category": "THE_GIOI",
                        "image": dataR[0].imagesLinkList[0],
                    }
                    dataHomepage.data.push(temp);
                    Item.find({ category: "KINH_DOANH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                        if (err) {
                            console.log('Error in get all from database', err);
                            res.send(err);
                        }
                        dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                        var temp = {
                            "category": "KINH_DOANH",
                            "image": dataR[0].imagesLinkList[0],
                        }
                        dataHomepage.data.push(temp);
                        Item.find({ category: "GIAI_TRI", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                            if (err) {
                                console.log('Error in get all from database', err);
                                res.send(err);
                            }
                            dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                            var temp = {
                                "category": "GIAI_TRI",
                                "image": dataR[0].imagesLinkList[0],
                            }
                            dataHomepage.data.push(temp);
                            Item.find({ category: "THE_THAO", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                if (err) {
                                    console.log('Error in get all from database', err);
                                    res.send(err);
                                }
                                dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                var temp = {
                                    "category": "THE_THAO",
                                    "image": dataR[0].imagesLinkList[0],
                                }
                                dataHomepage.data.push(temp);
                                Item.find({ category: "PHAP_LUAT", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                    if (err) {
                                        console.log('Error in get all from database', err);
                                        res.send(err);
                                    }
                                    dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                    var temp = {
                                        "category": "PHAP_LUAT",
                                        "image": dataR[0].imagesLinkList[0],
                                    }
                                    dataHomepage.data.push(temp);
                                    Item.find({ category: "GIAO_DUC", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                        if (err) {
                                            console.log('Error in get all from database', err);
                                            res.send(err);
                                        }
                                        dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                        var temp = {
                                            "category": "GIAO_DUC",
                                            "image": dataR[0].imagesLinkList[0],
                                        }
                                        dataHomepage.data.push(temp);
                                        Item.find({ category: "SUC_KHOE", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                            if (err) {
                                                console.log('Error in get all from database', err);
                                                res.send(err);
                                            }
                                            dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                            var temp = {
                                                "category": "SUC_KHOE",
                                                "image": dataR[0].imagesLinkList[0],
                                            }
                                            dataHomepage.data.push(temp);
                                            Item.find({ category: "GIA_DINH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                if (err) {
                                                    console.log('Error in get all from database', err);
                                                    res.send(err);
                                                }
                                                dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                var temp = {
                                                    "category": "GIA_DINH",
                                                    "image": dataR[0].imagesLinkList[0],
                                                }
                                                dataHomepage.data.push(temp);
                                                Item.find({ category: "DU_LICH", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                    if (err) {
                                                        console.log('Error in get all from database', err);
                                                        res.send(err);
                                                    }
                                                    dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                    var temp = {
                                                        "category": "DU_LICH",
                                                        "image": dataR[0].imagesLinkList[0],
                                                    }
                                                    dataHomepage.data.push(temp);
                                                    Item.find({ category: "KHOA_HOC", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                        if (err) {
                                                            console.log('Error in get all from database', err);
                                                            res.send(err);
                                                        }
                                                        dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                        var temp = {
                                                            "category": "KHOA_HOC",
                                                            "image": dataR[0].imagesLinkList[0],
                                                        }
                                                        dataHomepage.data.push(temp);
                                                        Item.find({ category: "SO_HOA", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                            if (err) {
                                                                console.log('Error in get all from database', err);
                                                                res.send(err);
                                                            }
                                                            dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                            var temp = {
                                                                "category": "SO_HOA",
                                                                "image": dataR[0].imagesLinkList[0],
                                                            }
                                                            dataHomepage.data.push(temp);
                                                            Item.find({ category: "CONG_DONG", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                                if (err) {
                                                                    console.log('Error in get all from database', err);
                                                                    res.send(err);
                                                                }
                                                                dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                                var temp = {
                                                                    "category": "CONG_DONG",
                                                                    "image": dataR[0].imagesLinkList[0],
                                                                }
                                                                dataHomepage.data.push(temp);
                                                                Item.find({ category: "TAM_SU", content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
                                                                    if (err) {
                                                                        console.log('Error in get all from database', err);
                                                                        res.send(err);
                                                                    }
                                                                    dataR[0].imagesLinkList[0].image = dataR[0].imagesLinkList[0].image.replace(/_180x108/g, '');
                                                                    var temp = {
                                                                        "category": "TAM_SU",
                                                                        "image": dataR[0].imagesLinkList[0],
                                                                    }
                                                                    dataHomepage.data.push(temp);
                                                                    res.json(dataHomepage);
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    postSavedItem: function(req, res) {
        if (req.body) {
            SavedItem.findOne({ itemId: req.body.id }).exec(function(err, data) {
                if (data) {
                    res.json({ status: false, message: 'User are already exist!' })
                } else {
                    var myObjectId = new ObjectId(req.body.id);
                    Item.find({ _id: myObjectId }).exec(function(err, data) {
                        console.log(data)
                        var newItem = {
                            item: data,
                            itemId: req.body.id
                        }
                        SavedItem.create(newItem, function(err, data) {
                            res.json({ status: true, message: 'Success' });
                        });
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
                console.log(data)
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
            if (err) {
                res.json(err)
            }
            res.json(data)
        });
    }
}