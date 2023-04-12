import express, { Application } from 'express'
import { config } from 'dotenv';
import colors from 'colors';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';
import connectDB from './config/db.config'
import { request, gql, GraphQLClient } from 'graphql-request'
import { GraphQLClient as GraphQLClientType } from 'graphql-request/dist/index'
import Tatum from './tantum.sv'
import Wallet from './models/Wallet.model';
import Address from './models/Address.model';

config();

const runCoin = async () => {

    if(process.env.BUYCOINS_SCERET_KEY && process.env.BUYCOINS_PUBLIC_KEY &&  process.env.BUYCOINS_API_URL){

        const authValue = Buffer.from(process.env.BUYCOINS_PUBLIC_KEY + ':' + process.env.BUYCOINS_SCERET_KEY).toString('base64');

        const client: GraphQLClientType = new GraphQLClient(process.env.BUYCOINS_API_URL, {
            headers: {
                authorization: `Basic ${authValue}`
            }
        });

        // generate address
        const createAddress = gql `
        mutation {
            createAddress(cryptocurrency: bitcoin) {
                cryptocurrency,
                address
            }
        }
        `

        // await client.request(createAddress).then((resp) => {
        //     console.log(resp);
        // }).catch((err) => {
        //     console.log(JSON.stringify(err.response))
        // })

        // get estimated network fee:
        // this will show you what you're likely to be charged if you're sending out
        const getFee = gql `
        query {
            getEstimatedNetworkFee(cryptocurrency: bitcoin, amount: 0.01) {
                estimatedFee,
                total
            }
        }
        `

        // await client.request(getFee).then((resp) => {
        //     console.log(resp);
        // }).catch((err) => {
        //     console.log(JSON.stringify(err.response))
        // })

        // get balances:
        const getBalances = gql `
        query {
            getBalances(cryptocurrency: bitcoin){
                id
                cryptocurrency
                confirmedBalance
            }
        }
        `
        await client.request(getBalances).then((resp) => {
            console.log(resp);
        }).catch((err) => {
            console.log(JSON.stringify(err.response))
        })

    }

}

const runTatum = async () => {

    // generate BTC Wallet
    const mnemonic = 'urge pulp usage tobi evidence arrest palm math please chief egg abuse';
    const btcWallet = await Tatum.generateBTCWallet(mnemonic);

    const existW = await Wallet.findOne({ mnemonic: btcWallet.data.mnemonic });

    if(!existW){

        const wallet = await Wallet.create({
            name: 'New BTC Wallet',
            description: 'New generate BTC wallet',
            mnemonic: btcWallet.data.mnemonic,
            xpub: btcWallet.data.xpub,
            chain: 'bitcoin',
            symbol: 'BTC'
        });

    }

    // generate BTC address for BTC wallet
    const wallets = await Wallet.find({ chain: 'bitcoin' });

    if(wallets && wallets.length > 0){

        const wallet = await Wallet.findOne({_id: wallets[0]._id}); // pick the first

        if(wallet){

            const btcAdd = await Tatum.generateBTCAddress(wallet.xpub, 0);
            const extAdd = await Address.findOne({ addrx: btcAdd.data.address });

            if(!btcAdd.error && !extAdd){

                const address = await Address.create({
                    name: 'BTC wallet address',
                    description: 'New btc wallet address',
                    addrx: btcAdd.data.address,
                    wallet: wallet._id
                });

                // generate private key for wallet address
                const btcPriv = await Tatum.generateBTCPrivateKey(wallet.mnemonic, 0);

                if(!btcPriv.error){
                    address.priv = btcPriv.data.key;
                    await address.save();
                }

            }

        }

    }

    // get BTC chain info
    // const info = await Tatum.getBTCBlockHash();
    // console.log(info.data);
    
    // get Block by Hash
    // 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
    // const block = await Tatum.getBTCBlockByHash('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
    // console.log(block.data);

    // get txn by hash
    const txn = await Tatum.sendBTCFromUtxo(
        { 
            txHash: '6dfa0c69cd91aaf350c2c73243291935db44ccaf0571c6abad492b6a9def5737', 
            index: 0,
            privateKey: 'KzG2TyUA5PR2kZgnwuLTvbeJ1ys91NwSeb3Mg7n6zKAQSkvu5AuU' 
        },
        { address: 'bc1qu269kzhqgw8w84murwfaurqn7040rhekpsp6yz', value: 0.001 }
    );
    console.log(txn.data);

}

// connect db
const connect = async () => {

    await connectDB();
    runTatum()

}

connect();

const app: Application = express();

const PORT = process.env.PORT || 5000;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development' ? true : false
}))

app.listen(PORT, () => {
    console.log(colors.yellow.bold(`Server running on port ${PORT}`))
})