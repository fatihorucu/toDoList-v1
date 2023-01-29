//Node Modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
// const date = require(__dirname +"/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs");
app.use(express.static("public")) // to be able to use public folder

//Setting up Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB")
mongoose.set("strictQuery",false);
const itemsSchema = new mongoose.Schema({
    name: String
});
const listSchema = new mongoose.Schema({
    name: String,
    itemList: [itemsSchema],
    pageDir: String
})
const List = mongoose.model("List",listSchema)
//Setting up Default items
const Item = mongoose.model("Item",itemsSchema)
const defaultItem1 = new Item({
    name: "Eat"
})
const defaultItem2 = new Item({
    name: "Code"
})
const defaultItem3 = new Item({
    name: "Sleep"
})

const defaultItems = [defaultItem1,defaultItem2,defaultItem3]


app.get("/", function(req, res){
    const pageName = ""
    List.findOne({pageDir:pageName},(err,result)=>{
        if(!err){
            if (result === null) {
                const list = new List({
                    name: "Today",
                    pageDir: "",
                    itemList: defaultItems
                })
                list.save()
                res.redirect("/"+ pageName)
            } else {
                res.render("list", {listTitle:result.name, itemList: result.itemList,pageDir:result.pageDir})
            }
        }
    })
});                                                   
app.post("/",function(req,res){
    let itemName = req.body.newItem;
    let pageDir = req.body.list;
    // if(req.body.list === "Work"){
    //     workItems.push(item)
    //     res.redirect("/work")
    // }else{
    //     items.push(item)
    //     res.redirect("/");
    // }
    const item = new Item({
        name: itemName
    })
    List.findOne({pageDir: pageDir},function(error,result){
        if(!error){
             item.save()
             result.itemList.push(item);
             result.save()
             res.redirect("/"+result.pageDir)
         }
    }) 
})

app.post("/delete",function(req,res){
    const listName = req.body.listName
    const itemId = req.body.checkbox
    console.log(listName);
    console.log(itemId);
    List.findOne({pageDir:listName},function(err,result){
        result.itemList.forEach(element => {
            if(element.id === itemId){
                result.itemList.remove(element)
                Item.findByIdAndDelete(itemId,function(err){})
                result.save()
                res.redirect("/"+listName)
            }
        });
    })
})
app.get("/:page",function(req,res){
    const pageName = req.params.page
    const pageTitle = _.startCase(pageName)
    List.findOne({pageDir:pageName},(err,result)=>{
        if(!err){
            if (result === null) {
                const list = new List({
                    name: pageTitle,
                    pageDir: pageName,
                    itemList: defaultItems
                })
                list.save()
                res.redirect("/"+ pageName)
            } else {
                res.render("list", {listTitle:result.name, itemList: result.itemList,pageDir:result.pageDir})
            }
        }
    })
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
