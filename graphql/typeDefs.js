const {gql} = require("apollo-server")


module.exports =  gql 
`
type reply{
    _id:ID!
    reply:String!
    author:String!
    createdAt:String
    updatedAt:String
}
input replyData{
    reply:String!
    _commentID:String!
    author:String!
    _blogId:String!
}
type comment{
    _id:ID!
    comment:String!
    author:String!
    reply:[reply]
    createdAt:String!
    updatedAt:String!
}
input commentData{
    _blogId:String!
    comment:String!
    author:String!
}
type blog{
_id:ID!
title:String!
content:String!
banner:String!
author:Author
likes:Int!
comment:[comment]!
createdAt:String!
updatedAt:String!
} 
input blogData{
    title:String!
    content:String!
    banner:String!
    authorID:String!
}
input updateBlogData{
    title:String!
    content:String!
    banner:String!
}
type Author{
    _id:ID!
    name:String
    profession:String
    age:String
    gender:String
   blogs: [blog]
}
input authorData{
    name:String!
    profession:String!
    age:String
    gender:String
}
type AuthorsData{
    authors:[Author]!
}
type BlogsData{
    blogs:[blog]!
}
type Query{
    getauthors:AuthorsData!
    getblogs:BlogsData!
   
     getauthor(id:ID!):Author!
    getblog(id:ID!):blog!
    getcomment(blogid:ID! , commentid:ID!):comment!
    getreply(blogid:ID! , commentid:ID! , replyid:ID!):reply!
}
type Mutation{
    createAuthor(authorInput:authorData):Author!
    createBlog(blogInput:blogData):blog!
    createComment(commentInput:commentData):comment!
    createReply(replyInput:replyData):reply!
    deleteComment(blogid:ID! , commentid:ID!):Boolean
    deleteBlog(id:ID!):Boolean
    increaseLikes(blogid:ID!):Boolean
    decreaseLikes(blogid:ID!):Boolean
    updateBlog(id:ID! , blogInput:updateBlogData):blog!
}
  
`