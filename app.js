const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const PORT = process.env.PORT || 8000;
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });


const itemsSchema = {
    name: String
};


const ItemModel = mongoose.model("item", itemsSchema);

const Item1 = new ItemModel({
    name: "buy food"
});

const Item2 = new ItemModel({
    name: "Click + to create a new Item"
});

const Item3 = new ItemModel({
    name: "click x to delete one"
});

const defaultItem = [Item1, Item2, Item3];
//new schema for list


const listSchema = {
    name: String,
    items: [itemsSchema] //Relating one schema to other
}

const List = mongoose.model("List", listSchema);

const workItems = [];
app.get("/", (req, res) => {
    // var date = new Date();
    // var options = {
    //     weekday: "long",
    //     day: "numeric",
    //     month: "long"
    // };
    // var day = date.toLocaleDateString("hi-IN", options);


    ItemModel.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            ItemModel.insertMany(defaultItem, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("insert successfull");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", {
                ListTitle: "Today",
                newItemLists: foundItems
            });
        }
    });

});

app.post("/", (req, res) => {
    console.log(req.body);
    let itemName = req.body.newItem;
    let listName = req.body.list;

    const item = new ItemModel({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        ItemModel.findByIdAndRemove(checkedItemId, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }



});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                console.log("dosent exists");
                const list = new List({
                    name: customListName,
                    items: defaultItem
                });
                list.save();
                res.redirect("/" + customListName);
            }
            
            else {
                res.render("list", {
                    ListTitle: foundList.name,
                    newItemLists: foundList.items,
                });
                // console.log("exists");
            }
        }
    });


    // res.redirect("/")
});

app.listen(PORT, () => {
    console.log("listeing");
});
