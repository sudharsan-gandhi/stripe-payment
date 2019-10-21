const stripe = require('./helper');
var inquirer = require('inquirer');


async function init() {
    const { product_name, name, email } = await inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'product name?'
        },
        {
            type: 'input',
            name: 'name',
            message: 'enter user name'
        },
        {
            type: 'input',
            name: 'email',
            message: 'enter email'
        }]);

    console.log(product_name, email, name)
    if (product_name && email && name) {
        run(product_name, name, email);
    }
}

init();


async function run(product_name, name, email) {
    try {
        let product = await stripe.createProduct(product_name);
        let plan = await stripe.createPlan(product.id);
        let user = await stripe.createUser(name, email);
        let subscription = await stripe.createSubscription(plan, user);
        
    } catch (error) {
        console.error(error);
    }
}