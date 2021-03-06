// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.

//------------------------------------------------
	//Dependancies
var inquirer = require('inquirer');
var mysql = require('mysql');

//------------------------------------------------
	//UI
var questions = [
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
];

inquirer.prompt(questions).then(function (answers) {
  console.log(JSON.stringify(answers, null, '  '));
});

