var express = require('express');
var express_graphql = require('express-graphql');
var {buildSchema} = require('graphql');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        course(topic: String): [Course]
      
    }

    type Course {
        id: String
        title: String
        author: String
       description: String
       topic: String
       url: String
    }

    `);


    var coursesData = [
        {
    id: 1,
    title: 'The Complete Node.js Developer Course',
    author: 'Andrew Mead, Rob Percival',
    description: 'Learn Node. js by building real-world applications with Node, Express, MongoDB,',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs/'
        }
    ]


    var getCourse = function(args) {
        var id=args.id;
        return coursesData.filter(course => {
            return coursesData.id==id;
        })[0];
    }

    var getCourses = function(args) {
        if (args.topic) {
            var topic = args.topic;
            return coursesData.filter(course => course.topic === topic);
        } else {
            return coursesData;
        }
    }

    // Root resolver
    var root = {
        

    };

    // Create an express server
    var app = express();
    app.use('/graphql', express_graphql9({
        schema: schema,
        rootvalue: root,
        graphql: true
    }));

    app.listen(4000, () => console.log ('Express GraphQL Server Now Running On localhost:4000/graphql'));