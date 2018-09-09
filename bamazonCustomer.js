var mysql = require("mysql");
var inquirer = require("inquirer");
// var {table} = require("table");
var table = require("console.table");

var itemData;

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazondb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    queryData();
    whatToBuy();
});


function queryData() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("--------------------------------------------------------------")
        console.log("                   Welcome to bamazon!            ")
        console.log("--------------------------------------------------------------")
        console.table(res);
        // for (var i = 0; i < res.length; i++) {
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | "+ res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        // }
        console.log("--------------------------------------------------------------");
    })
};

function whatToBuy() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "What item would you like to purchase? (Please enter the item ID):",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            // console.log(answer);      
            connection.query("SELECT product_name, price, stock_quantity FROM products WHERE ?", {item_id: answer.id}, function(err, res) {
                console.log("\n You would like to buy " + answer.quantity + " " + res[0].product_name + " at $" + res[0].price + " each");
                
                if (res[0].stock_quantity >= answer.quantity) {
                    var itemQuantity = res[0].stock_quantity - answer.quantity;
                    connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: itemQuantity
                    }, {
                        item_id: answer.id
                    }], function(err, res) {});
                    var cost = res[0].price * answer.quantity;
                    console.log("\n Your order is on it's way!  Your cost is $" + cost.toFixed(2) + "\n");
                    buyAgain();
                } else {
                    console.log("\n Sorry, this item is so popular we just don't have enough in stock to fulfill your order. \n");
                    buyAgain();
                }
            })
        })
    })
};

function buyAgain () {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to buy something else?",
            name: "confirm",
            default: true
        }
    ])
    .then(function(answer) {
        if(answer.confirm) {
            queryData();
            whatToBuy();
        } else {
            console.log("\n Thanks for visiting bamazon, have a great day!");
            connection.end();
        }
    })
}

