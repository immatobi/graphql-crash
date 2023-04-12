import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'
import { IClientDoc } from '../utils/types.util'

const ClientSchema = new mongoose.Schema (

    {

        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        },

        slug: String

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

ClientSchema.set('toJSON', { getters: true, virtuals: true });

ClientSchema.pre<IClientDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

ClientSchema.statics.getAllUsers = () => {
    return Client.find({});
}

// define the model constant
const Client = mongoose.model<IClientDoc>('Client', ClientSchema);

export default Client;
