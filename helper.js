// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = require('stripe')('sk_test_JtBsWv3WdOtdv7FTlvC0Kzay00xN3NZvuA');
const REPL = require('repl');

async function createProduct(name) {
    const product = await stripe.products.create({
        name: name,
        type: 'service',
    });
    return product;
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

async function updatePlanAmount(id, amount) {
    const plan = await stripe.plans.update(id, {amount: amount});
    return plan;
}

async function createUser(name, email) {
    const customer = await stripe.customers.create({
        name: name,
        email: email,
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
        ],
        billing_thresholds : {
            amount_gte: 100,
            reset_billing_cycle_anchor: true
        }
    });
    return subscription;
}

async function chargeUser(user, amount) {
    let charge = stripe.charges.create({
        customer: user.id,
        amount,
        description: `testing with amount ${amount}`,
        currency: 'usd'
    })
    return charge;
}

async function createPOJO(product_name, username, email) {
    const product = await createProduct(product_name);
    const plan = await createPlan(product.id);
    const user = await createUser(username, email);
    const subscription = await createSubscription(plan, user);
    const pojo = {product, plan, user, subscription};
    return pojo
}





module.exports = pay = {
    createProduct: createProduct,
    createPlan: createPlan,
    createUser: createUser,
    getUser: getUser,
    createSubscription: createSubscription,
    chargeUser: chargeUser,
    createPOJO: createPOJO,
    updatePlanAmount: updatePlanAmount
}

if (process.env.console) {
    const server = REPL.start({
        prompt: 'stripe> ',
        useGlobal: true,
        output: process.stdout,
        input: process.stdin,
        terminal: true,
    })
    // server.context.stripe = stripeObject
}
