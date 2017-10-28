'use strict';
var mysql = require("mysql");
var inquirer = require("inquirer");
var EventEmitter = require('events');
var util = require('util');


//------------------------------------------------
	//Connect to mySQL

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

//------------------------------------------------
	//User chooses Customer, Manager, or Supervisor path

connection.connect(function(err) {
  if (err) {
  	throw err;
	console.log("There was a problem connecting to mySQL Server.");
	}

  	else chooseRole();
});

function chooseRole() {
	inquirer
	    .prompt({
	      name: "action",
	      type: "list",
	      message: "What would you like to do?",
	      choices: [
	        "Shop Bamazon",
	        "Bamazon Manager View",
	        "Bamazon Supervisor View",
	        "Exit Bamazon"
	      ]
	    })
	    .then(function(answer) {
	      switch (answer.action) {
	        case "Shop Bamazon":
	          bamCustomer.welcome();
	          //bamCustomer.on('welcome', purchaseOrder);
	          break;

	        case "Bamazon Manager View":
	          bamManager.welcome();
	          break;

	        case "Bamazon Supervisor View":
	          bamSupervisor();
	          break;

	        case "Exit Bamazon":
	          console.log("Goodbye.");
	          process.exit();
	          break;
	      }

	    });	
}

class BamUser {
	hi() {
		console.log('Hi');
	}
}
util.inherits(BamUser, EventEmitter);

var bamCustomer = new BamUser(); 
var bamManager = new BamUser();

BamUser.prototype.welcome = function() {
	console.log('\x1b[33m%s\x1b[0m', '\n Welcome to Bamazon');
	console.log('----------------------------------------');
	var query = "SELECT * FROM products";
		      connection.query(query, { item_id: 1 }, function(err, res) {
		        for (var i = 0; i < res.length; i++) {
		          console.log("ID:" + res[i].item_id + " || Title: " + res[i].product_name + " || Price: " + res[i].price);

		        } 
		        console.log("\n")
		        purchaseOrder(res);
		      });
		      
}
var purchaseOrder = function() {
	inquirer
		.prompt([
	{
	 type: 'input',
	 name: 'product_id',
	 message: 'Which product(ID) would you like to purchase?'
	 //filter: Number
	},
	{
	 type: 'input',
	 name: 'quantity',
	 message: 'How many would you like to buy?',
	 validate: function (value) {
	 	var pass = value.match();
	 	if (pass) {
	 		return true;
	 	}

	 	return 'Please enter a valid amount.';
	 }
	}
]
)
		.then(function(answer){

			var query = "SELECT * FROM products WHERE ?";
		      connection.query(query, { item_id: answer.product_id }, function(err, res) {
		      	var purchaseQuantity = answer.quantity;
		        var stockQuantity = res[0].stock_quantity;
		        var newStock = stockQuantity - purchaseQuantity;
		        if (stockQuantity >= answer.quantity) {
		        	console.log("You've purchased " + purchaseQuantity + " copies of " + res[0].product_name + ".")
		        	
		        	updateInventory(newStock,answer.product_id);
		        }
		        else console.log("We're sorry there aren't enough copies of " + res[0].product_name + " available to purchase.")
		      })
			
		});
}

function updateInventory(a, b) {
	var query = connection.query("UPDATE products SET ? WHERE ?",
	[
	 {
	 	stock_quantity: a
	 },
	 {
	 	item_id: b
	 }
	],
	function(err, res) {
		console.log( "Products updated!\n");
		chooseRole(res);
	}
	);

}



function bamSupervisor() {
	console.log('Welcome Bamazon Supervisor');
}