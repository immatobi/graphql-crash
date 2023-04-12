import Project from '../models/Project.model'
import Client from '../models/Client.model'
import { IClientDoc, IProjectDoc } from '../utils/types.util'

import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} from 'graphql'


const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: { 
            type: ClientType,
            resolve(parent: IProjectDoc, data: any){
                return Client.findOne({ _id: parent.client })
            }
        }
    })
})

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

        projects: {
            type: new GraphQLList(ProjectType),
            resolve: (parent: any, data: IProjectDoc) => {
                return Project.find({});
            }
        },

        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve: (parent: any, data: IProjectDoc) => {
                return Project.findOne({ _id: data._id })
            }
        },

        clients: {
            type: new GraphQLList(ClientType),
            resolve: (parent: any, data: IClientDoc) => {
                return Client.find({});
            }
        },

        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve: (parent: any, data: IClientDoc) => {
                return Client.findOne({ _id: data._id })
            }
        }

    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        
        // add a client
        addClient: {
            type: ClientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent: any, data: IClientDoc){

                const client: IClientDoc =  new Client({
                    name: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber
                });

                return client.save();
            }
        },

        // delete client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent: any, data: IClientDoc){

                const client = Client.findOneAndDelete({ _id: data.id });
                return client;

            }
        },

        // add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: { 
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            pending: { value: 'pending' },
                            progress: { value: 'in-progress' },
                            completed: { value: 'completed' }
                        }
                    }),
                    defaultValue: 'pending'
                 },
                 client: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent: any, data: IProjectDoc){

                const project: IProjectDoc =  new Project({
                    name: data.name,
                    description: data.description,
                    status: data.status,
                    client: data.client
                });

                return project.save();
            }
        },

        // delete project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent: any, data: IProjectDoc){

                const project = Project.findOneAndDelete({ _id: data.id });
                return project;

            }
        },

        // update project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { 
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            pending: { value: 'pending' },
                            progress: { value: 'in-progress' },
                            completed: { value: 'completed' }
                        }
                    })
                 },
            },
            resolve(parent: any, data: IProjectDoc){

                const project = Project.findOneAndUpdate(data.id, {
                    name: data.name,
                    description: data.description,
                    status: data.status  
                });
                
                return project;

            }
        },
    }
})

export default new GraphQLSchema({ query: RootQuery, mutation: mutation })