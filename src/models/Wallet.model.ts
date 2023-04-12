import mongoose, { Mongoose, ObjectId } from 'mongoose'
import slugify from 'slugify'
import { IWalletDoc } from '../utils/types.util'

const WalletSchema = new mongoose.Schema (

    {

        name: {
            type: String
        },

        description: {
            type: String
        },

        mnemonic:{
            type: String
        },

        xpub:{
            type: String
        },

        priv: {
            type: String
        },

        chain:{
            type: String
        },

        symbol:{
            type: String
        },

        slug: String,

        addresses: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Address'
        }

    },

    {
        timestamps: true,
        versionKey: '_version',
        toJSON: {
            transform(doc, ret){
                ret.id = ret._id
            }
        }
    }

)

WalletSchema.set('toJSON', { getters: true, virtuals: true });

WalletSchema.pre<IWalletDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

WalletSchema.statics.getAllWallets = () => {
    return Wallet.find({});
}

// define the model constant
const Wallet = mongoose.model<IWalletDoc>('Wallet', WalletSchema);

export default Wallet;
