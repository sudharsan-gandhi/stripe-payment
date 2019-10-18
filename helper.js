// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_JtBsWv3WdOtdv7FTlvC0Kzay00xN3NZvuA');
const REPL = require('repl');

async function createProduct(name) {
    const product = await stripe.products.create({
        name: name,
        type: 'service',
    });
}

async function createPlan(product_id) {
    const plan = await stripe.plans.create({
        currency: 'usd',
        interval: 'month',
        product: product_id,
        nickname: 'metered connection',
        amount: 500,
        usage_type: 'metered',
    });
    return plan;
}

async function createUser() {
    const customer = await stripe.customers.create({
        name: "test customer",
        email: "testcustomer1@gmail.com",
        description: 'test customer',
        source: "tok_1FUvCsHWyDmfOAlYOQCgsJN6" // obtained with Stripe.js
    });
    return customer;
}

async function getUser(id) {
    if (id) {
        return await stripe.customers.retrieve(id)
    }
    else {
        return await stripe.customers.list({ limit: 3 })
    }
}

async function createSubscription(plan, customer) {
    let subscription = stripe.subscriptions.create({
        customer: customer.id,
        items: [
            {
                plan: plan.id,
            }
        ]
    });
}





module.exports = stripeObject = {
    createProduct: createProduct,
    createPlan: createPlan,
    createUser: createUser,
    getUser: getUser,
    createSubscription: createSubscription
}

if (process.env.console) {
    const server = REPL.start({
        prompt: 'stripe> ',
        useGlobal: true,
        output: process.stdout,
        input: process.stdin,
        terminal: true,
    })
    server.context.stripe = stripeObject
}
