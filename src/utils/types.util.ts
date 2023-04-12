import mongoose, { ObjectId } from 'mongoose'

export interface IClientDoc extends mongoose.Document{

    name: string,
    email: string,
    phoneNumber: string,
    slug: string,

    project: mongoose.Schema.Types.ObjectId;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllClients(): IClientDoc

}

export interface IProjectDoc extends mongoose.Document{

    name: string,
    description: string,
    status: string
    slug: string,

    client: mongoose.Schema.Types.ObjectId;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllProjects(): IProjectDoc

}

export interface IWalletDoc extends mongoose.Document{

    name: string,
    description: string,
    mnemonic: string
    xpub: string;
    chain: string;
    symbol: string;
    slug: string;

    addresses: Array<ObjectId | IAddressDoc>;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllWallets(): IWalletDoc

}

export interface IAddressDoc extends mongoose.Document{

    name: string,
    description: string,
    addrx: string
    priv: string;
    slug: string;

    wallet: ObjectId | IWalletDoc;

    // time stamps
    createdAt: string;
    updatedAt: string;
    _version: number;
    _id: mongoose.Schema.Types.ObjectId;
    id: mongoose.Schema.Types.ObjectId;

    // functions
    getAllAddress(): IAddressDoc

}