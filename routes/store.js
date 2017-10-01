var MongoClient = require('mongodb').MongoClient;
var request = require('request-json');
var client = request.createClient('http://recommendations.ai.svc.cluster.local:8080');

var url = process.env.mongo_url;  //"mongodb://app_user:password@127.0.0.1/store"
var db=null;
console.log(url);

MongoClient.connect(url, function(err, dbconnection) {
    if (err) throw err;
    db=dbconnection;
});


exports.findById = function(req, res) {    
    var id = parseInt(req.params.id);    
    db.collection('Products', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};
exports.getAllCategories = function(req, res) {  
	console.log('fetching cats...');
    db.collection('Categories', function(err, collection) {
        collection.find({}).toArray(function(err, items) { 			
			res.jsonp(items);
        });
    });
};
exports.findBySubCat = function(req, res) {
    var id = parseInt(req.params.id);
    console.log('fetching by subCat...'+id); 
    console.log('headers',req.headers);   
    db.collection('Products', function(err, collection) {
        collection.find({'subCat': id}).toArray(function(err, items) { 
            client.headers['x-request-id']=req.headers['x-request-id'];
            client.headers['x-b3-traceid']=req.headers['x-b3-traceid'];
            client.headers['x-b3-spanid']=req.headers['x-b3-spanid'];
            client.headers['x-b3-parentspanid']=req.headers['x-b3-parentspanid'];
            client.headers['x-b3-sampled']=req.headers['x-b3-sampled'];
            client.headers['x-b3-flags']=req.headers['x-b3-flags'];
            client.headers['x-ot-span-context']=req.headers['x-ot-span-context'];
            client.headers['cookie']=req.headers['cookie'];
            client.get('/', function(err, res2, body) {
                console.log("recco",err,body);
                if(err){
                  console.log('recommendations failed');
                  res.jsonp(items)
                }
                else{
                  console.log('recommendations fetched');
                  res.jsonp(items.concat(body));
                }
            });
        });
    });
};

exports.findAll = function(req, res) {
    
    var name = req.query["name"];
    db.collection('Products', function(err, collection) {
        //client.headers=req.headers;
        client.get('/', function(err, res2, body) {
            if (name) {
                collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                    res.jsonp(items.concat(body));
                });
            } else {
                collection.find().toArray(function(err, items) {
                    res.jsonp(items.concat(body));
                });
            }
        });
    });
    
};

exports.insertDummyData = function(){	
	var categories = [
		{id:1,CatName:"Wireless",SubCats:[{id:1,name:"RF"},{id:2,name:"XBEE"},{id:3,name:"Wifi"},{id:4,name:"Bluetooth"}]},
		{id:2,CatName:"Development Boards",SubCats:[{id:5,name:"Arduino"},{id:6,name:"ARM"},{id:7,name:"8051"},{id:8,name:"AVR"}]},
		{id:3,CatName:"Sensors",SubCats:[{id:9,name:"Ultrasonic"},{id:10,name:"GPS"},{id:11,name:"IR"},{id:12,name:"Light"}]}
	];		
	db.collection('Categories', function(err, collection) {							
		collection.insert(categories, {safe:true}, function(err, result) {
			console.log(err,result,"cat data inserted");	
		});					
	});
	
	var products=[ {product_id:'cable_1',name:"Wire",title:"Wire",img:'img/storeImages/08566-01-L_l_th.jpg',images:['storeImages/08566-01-L_l_th.jpg'],
        documents:"Wire",features:"Wire",shipping:55,caption:"Cable Wire",price:20,subCat:1}]
	
	db.collection('Products', function(err, collection) {							
		collection.insert(products, {safe:true}, function(err, result) {
			console.log(err,result,"products data inserted");	
		});					
	});
};

//Handle Cleanup
process.on('SIGTERM', function () {
    MongoClient.close();
});
