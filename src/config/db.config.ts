import mongoose from 'mongoose'
import colors from 'colors'

mongoose.Promise = global.Promise;

const options: object = {

    useNewUrlParser: true,
    autoIndex: true,
    keepAlive: true,
    maxPoolSize: 1000,
    wtimeoutMS:60000,
    connectTimeoutMS: 60000,
    socketTimeoutMS: 60000,
    serverSelectionTimeoutMS: 60000,
    family: 4,
    useUnifiedTopology: true

}

const connectDB = async (): Promise<void> => {

    const dbConn = await mongoose.connect(process.env.MONGODB_URI || '', options);
    console.log(colors.cyan.bold.underline(`Database connected: ${dbConn.connection.host}`));

}

export default connectDB;

