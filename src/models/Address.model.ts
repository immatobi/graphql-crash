import mongoose, { Mongoose, ObjectId } from 'mongoose'
import slugify from 'slugify'
import { IAddressDoc } from '../utils/types.util'

const AddressSchema = new mongoose.Schema (

    {

        name: {
            type: String
        },

        description: {
            type: String
        },

        addrx:{
            type: String
        },

        priv:{
            type: String
        },

        slug: String,

        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet'
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

AddressSchema.set('toJSON', { getters: true, virtuals: true });

AddressSchema.pre<IAddressDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

AddressSchema.statics.getAllWallets = () => {
    return Address.find({});
}

// define the model constant
const Address = mongoose.model<IAddressDoc>('Address', AddressSchema);

export default Address;
