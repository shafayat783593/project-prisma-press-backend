import config from "../../config"
import { prisma } from "../../lib/prisma"
import { stripe } from "../../lib/stripe"




const createCheckoutsession = async (userId: string) => {
    const transactionResult = await prisma.$transaction(async (tex) => {

        const user = await tex.user.findFirstOrThrow({
            where: {
                id: userId
            },
            include: {
                subscription: true
            }

        })
        // old subscription
        let sriptCustomerId = user.subscription?.stripeCustomerId


        if (!sriptCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            })
            sriptCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: config.stripe_price_id,
                quantity: 1
            }],
            mode: 'subscription',
            customer: sriptCustomerId,
            payment_method_types: ["card"],
            
            success_url: `${config.app_url}/premium?success=true`,
            cancel_url:`${config.app_url}/payment?success=false`,
            metadata: { userId: user.id }
            
        })

        return session.url
    })
    return {
        paymentUrl :transactionResult
    }
}

export const subscriptionService = {
    createCheckoutsession
}