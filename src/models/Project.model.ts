import mongoose, { ObjectId } from 'mongoose'
import slugify from 'slugify'
import { IProjectDoc } from '../utils/types.util'

const ProjectSchema = new mongoose.Schema (

    {

        name: {
            type: String
        },

        description: {
            type: String
        },

        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed']
        },

        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
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

ProjectSchema.set('toJSON', { getters: true, virtuals: true });

ProjectSchema.pre<IProjectDoc>('save', async function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

ProjectSchema.statics.getAllUsers = () => {
    return Project.find({});
}

// define the model constant
const Project = mongoose.model<IProjectDoc>('Project', ProjectSchema);

export default Project;
