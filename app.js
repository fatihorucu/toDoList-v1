const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(express.static("public")) // to be able to use public folder
let items = [];
let workItems = [];
app.get("/", function(req, res){
    let today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    let day = today.toLocaleDateString("en-US",options)
    // var day = new Intl.DateTimeFormat("en-US", options).format(today);


    res.render("list", {listTitle: day, itemList: items}) // looks for a file called list.ejs in views directory. 
});                                                     // And changes the kindOfDay variable with day.
app.post("/",function(req,res){
    let item = req.body.newItem;
    console.log(req.body.list);
    if(req.body.list === "Work"){
        workItems.push(item)
        res.redirect("/work")
    }else{
        items.push(item)
        res.redirect("/");
    }
    
    
})

app.get("/work",function(req,res){
    res.render("list", {listTitle:"Work", itemList: workItems})
})

app.get("/about",function(req,res){
    res.render("about");
})

// app.post("/work",function(req,res){
//     let item = req.body.newItem;
//     workItems.push(item)
//     res.redirect("/work")
// })                                      // Since action of the form in the ejs file is posting to main page(/) 
                                        // this code isn't executed. So it is redirected inside of the app.post("/",...).

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});
