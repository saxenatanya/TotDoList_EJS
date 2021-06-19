const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = ["build Resume", "Portfolio website"];
const workItems=[];
app.get("/", (req, res) => {
    var date = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = date.toLocaleDateString("hi-IN", options);
    res.render("list", {
        ListTitle: day,
        newItemLists: items
    });
});

app.post("/", (req, res) => {
    console.log(req.body);
    let  item= req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    
});


app.get("/work",(req,res) =>{
    res.render("list",{
        ListTitle:"Work",
        newItemLists:workItems,
    });
});

app.post("/work",(req,res) =>{

});


app.listen(PORT, () => {
    console.log("listeing");
});
