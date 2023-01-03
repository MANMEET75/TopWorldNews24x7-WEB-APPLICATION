const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const NewsAPI = require('newsapi');
const { title } = require("process");
const newsapi = new NewsAPI('b29ec75224074f9f8cc78a2112813313');

const app=express();
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
})
app.get("/style.css",function(req,res){
    res.sendFile(__dirname+"/style.css")
})

app.post("/", function (req, res) {
    const source = req.body.source;
    const apiKey="b29ec75224074f9f8cc78a2112813313";
    const userAgent = req.get('user-agent');
    const options = {
    host: 'newsapi.org',
    path: '/v2/top-headlines?country='+source+'&apiKey='+apiKey,
    headers: {
      'User-Agent': userAgent
    }
  }
  https.get(options, function (response) {
  let data;
    response.on('data', function (chunk) {
        if (!data) {
            data = chunk;
        }
        else {
            data += chunk;
        }
    });
    response.on('end', function () {
        const newsData = JSON.parse(data);
        const articles=newsData.articles;
        console.log(articles)
        let newsHtml = "";

        articles.forEach(function(element,index){
            let news = `<div class="card">
            <div class="card-header" id="heading${index}">
                <h2 class="mb-0">
                <button class="btn btn-link collapsed" style="background-color: red;font-size:26px" type="button" data-toggle="collapse" data-target="#collapse${index}"
                    aria-expanded="false" aria-controls="collapse${index}">
                   <b style="color: antiquewhite;">Breaking News ${index+1}:</b> ${element["title"]}
                </button>
                </h2>
            </div>

            <div id="collapseExample${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#newsAccordion">
                <div class="card-body"> ${element["content"]}. <a href="${element['url']}" target="_blank" style="color: red;" >Read more here</a>  </div>
            </div>
        </div> 
        `;
        newsHtml += news;

        })

        // console.log(newsData);
        // const title=newsData.articles[0].title;
        // console.log(title);

        res.write(`<button style="font-size: 35px;background-color: red;">NEWS</button>`)
        res.write(`<body style="background-image: url(https://media.istockphoto.com/id/1286371622/photo/abstract-red-and-black-are-light-pattern-with-the-gradient-is-the-with-floor-wall-metal.jpg?b=1&s=170667a&w=0&k=20&c=RDAl7ILbKJESFDPeKnahjdPz4ElZa67VMJghhHIHwJE=);background-: no-repeat;background-size: cover;height:500px;width:90%";></body>`)
        
        res.write(`<h1 style="color: antiquewhite;font-size:30px";>${newsHtml}</h1>`)
        // res.render("list");
        res.send();
      });
    });
});




// the-times-of-india
// app.get("/",function(req,res){
//     // const url=`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${apiKey}`;
//     const url=`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`;
//     // now we are going to someone's else server over here
    
//     https.get(url,function(response){
//         console.log(response.statusCode);


//         response.on("data",function(data){
  
//                 let newsData=JSON.parse(data);
//                 // let articles=newsData.articles;
//                 // console.log(articles);

//                 res.send(newsData);

           


           



//         })
//     })
// })









app.listen(3000,function(){
    console.log("Server is running on 3000:Port over here");
})