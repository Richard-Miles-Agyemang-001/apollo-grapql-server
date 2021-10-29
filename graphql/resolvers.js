const Author =require("../Models/Author");
const Blog = require("../Models/Blog");
const mongoDb = require("mongodb");
const validator =  require("validator")
const {UserInputError} = require("apollo-server")
module.exports = {
  Query: {
    getauthors: async () => {
      const authors = await Author.find().populate("blogs");
      if (!authors) {
        const error = new Error("NO authors found");
        throw error;
      }

      return {
        authors: authors.map((author) => {
          return {
            ...author._doc,
            _id: author._id.toString(),
            blogs: author.blogs.map((blog) => {
              return {
                ...blog._doc,
                _id: blog._id.toString(),
                title: blog.title,
                content: blog.content,
              };
            }),
          };
        }),
      };
    },

    getauthor: async function (parent ,{ id },req) {
      try {
        const author = await Author.findById(id).populate("blogs");

        if (!author) {
          const error = new Error("Author not found");
          error.statusCode = 404;
          throw error;
        }

        return {
          ...author._doc,
          _id: author._id.toString(),
          name: author.name,
          profession: author.profession,
          age: author.age,
          gender: author.gender,
          blogs: author.blogs.map((blog) => {
            return {
              ...blog._doc,
              _id: blog._id.toString(),
              title: blog.title,
              content: blog.content,
            };
          }),
        };
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    getblogs: async function () {
      const blogs = await Blog.find().populate("author");

      if (!blogs) {
        const error = new Error("NO blogs found");
        throw error;
      }

      return {
        blogs: blogs.map((blog) => {
          return {
            ...blog._doc,
            title: blog.title,
            content: blog.content,
            banner: blog.banner,
            author: blog.author,
            comment: blog.comment.map((c) => {
              return {
                ...c._doc,
                comment: c.comment,
                _id: c._id.toString(),
                author: c.author,
                reply: c.reply.map((r) => {
                  return {
                    ...r._doc,
                    author: r.author,
                    _id: r._id,
                    reply: r.reply,
                    createdAt: r.createdAt.toISOString(),
                    updatedAt: r.updatedAt.toISOString(),
                  };
                }),
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
              };
            }),
            createdAt: blog.createdAt.toISOString(),
            updatedAt: blog.updatedAt.toISOString(),
          };
        }),
      };
    },
    getblog: async function (parent ,{ id },req) {
      try {
        const blog = await Blog.findById(id).populate("author");

        if (!blog) {
          const error = new Error("blog not found");
          error.statusCode = 404;
          throw error;
        }

        return {
          ...blog._doc,
          _id: blog._id.toString(),
          title: blog.title,
          content: blog.content,
          banner: blog.banner,
          author: blog.author,
          comment: blog.comment.map((c) => {
            return {
              ...c._doc,
              _id: c._id.toString(),
              comment: c.comment,
              author: c.author,
              reply: c.reply.map((r) => {
                return {
                  ...r._doc,
                  author: r.author,
                  _id: r._id.toString(),
                  reply: r.reply,
                  createdAt: r.createdAt.toISOString(),
                  updatedAt: r.updatedAt.toISOString(),
                };
              }),
              createdAt: c.createdAt.toISOString(),
              updatedAt: c.updatedAt.toISOString(),
            };
          }),
          createdAt: blog.createdAt.toISOString(),
          updatedAt: blog.updatedAt.toISOString(),
        };
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    getcomment: async function (parent ,{ blogid, commentid },req) {
      try {
        const blog = await Blog.findById(blogid);
        if (!blog) {
          const error = new Error("blog not found");
          error.statusCode = 404;
          throw error;
        }
        const comment = await blog.comment.find(
          (c) => c._id.toString() === commentid
        );

        if (!comment) {
          const error = new Error("comment not found");
          error.statusCode = 404;
          throw error;
        }

        return {
          ...comment._doc,
          _id: comment._id.toString(),
          comment: comment.comment,
          author: comment.author,
          reply: comment.reply.map((r) => {
            return {
              ...r._doc,
              _id: r._id.toString(),
              reply: r.reply,
              author: r.author,
              createdAt: r.createdAt.toISOString(),
              updatedAt: r.createdAt.toISOString(),
            };
          }),

          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.createdAt.toISOString(),
        };
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    getreply: async function (parent ,{ blogid, commentid, replyid },req) {
      try {
        const blog = await Blog.findById(blogid);
        if (!blog) {
          const error = new Error("blog not found");
          error.statusCode = 404;
          throw error;
        }
        const comment = await blog.comment.find(
          (c) => c._id.toString() === commentid
        );

        if (!comment) {
          const error = new Error("comment not found");
          error.statusCode = 404;
          throw error;
        }
        // console.log(comment);
        const reply = await comment.reply.find(
          (r) => r._id.toString() === replyid
        );

        if (!reply) {
          const error = new Error("NO reply found");
          error.statusCode = 404;
          throw error;
        }

        return {
          ...reply._doc,
          _id: reply._id.toString(),
          reply: reply.reply,
          author: reply.author,
          createdAt: reply.createdAt.toISOString(),
          updatedAt: reply.createdAt.toISOString(),
        };
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
  },

  Mutation: {
    createAuthor: async function ( parent , {authorInput}) {
        try{
      

      const errors =  []
      if(validator.isEmpty(authorInput.name)){
          errors.push({message:"name cannot be empty"});
      }
      if(validator.isEmpty(authorInput.profession)){
        errors.push({message:"profession cannot be empty"})
      }
       if(errors.length >0){
          throw new UserInputError("Invalid input values", {
            statusCode:422
          })
       }
      const newAuthor = await new Author({
        name: authorInput.name,
        profession: authorInput.profession,
        age: authorInput.age,
        gender: authorInput.gender,
      }).save();

      return {
        ...newAuthor._doc,
        _id: newAuthor._id.toString(),
        name: newAuthor.name,
        profession: newAuthor.profession,
        age: newAuthor.age,
        gender: newAuthor.gender,
      };}catch(err){
        
        err.statusCode= err.statusCode || 500
        throw err
      }
    },

    createBlog: async function ( parent,{ blogInput }) {
        
      try{
        const errors =[];
        if(validator.isEmpty(blogInput.title) || !validator.isLength(blogInput.title , {min:10 , max:200})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(blogInput.content) || !validator.isLength(blogInput.content , {min:100})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(blogInput.banner)){
          errors.push({message:"Invalid input"})
        }
       
        if(errors.length >0){
          throw new UserInputError("Invalid input values" , {
            statusCode:422
          });
        }

      const newblog = await new Blog({
        title: blogInput.title,
        content: blogInput.content,
        banner: blogInput.banner,
        author: mongoDb.ObjectId(blogInput.authorID),
      }).save();

      const author = await Author.findById(blogInput.authorID);
      // console.log(author);
      if (!author) {
        const error = new Error("No user with this id found");
        throw error;
      }
      author.blogs.push(newblog._id);
      await author.save();

      return {
        ...newblog._doc,
        _id: newblog._id.toString(),
        title: newblog.title,
        content: newblog.content,
        banner: newblog.banner,
        author: { ...author._doc, name: author.name },
        createdAt: newblog.createdAt.toISOString(),
        updatedAt: newblog.updatedAt.toISOString(),
      };}catch(err){

        err.statusCode = err.statusCode || 500
        throw err
      }
    },

    updateBlog: async function ( parent,{ id, blogInput }) {
      try {

        const errors =[];
        if(validator.isEmpty(blogInput.title) || !validator.isLength(blogInput.title , {min:10 , max:200})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(blogInput.content) || !validator.isLength(blogInput.content , {min:100})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(blogInput.banner)){
          errors.push({message:"Invalid input"})
        }
       
        if(errors.length >0){
          throw new UserInputError("Invalid input values");
        }
          
        const blog = await Blog.findById(id).populate("author");
        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }
        blog.title = blogInput.title;
        blog.banner = blogInput.banner;
        blog.content = blogInput.content;

        const updatedBlog = await blog.save();

        return {
          ...updatedBlog._doc,
          _id: updatedBlog._id.toString(),
          title: updatedBlog.title,
          content: updatedBlog.content,
          banner: updatedBlog.banner,
          author: { ...updatedBlog.author._doc, name: updatedBlog.author.name },
          createdAt: updatedBlog.createdAt.toISOString(),
          updatedAt: updatedBlog.updatedAt.toISOString(),
        };
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    deleteBlog: async function ( parent,{ id },req) {
      try {
        const blog = await Blog.findById(id);
        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }
        //  console.log(blog)
        const author = await Author.findById(blog.author);
        if (!author) {
          const error = new Error("Author not found");
          error.statusCode = 404;
          throw error;
        }
        author.blogs.pull(id);
        await Blog.findByIdAndRemove(id);
        return true;
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    createComment: async function (parent ,{ commentInput },req) {
      try {

        const errors =[];
        if(validator.isEmpty(commentInput.comment) || !validator.isLength(commentInput.comment , {min:10 , max:200})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(commentInput.author)){
          errors.push({message:"Invalid input"})
        }
       
        if(errors.length >0){
          throw new UserInputError("Invalid input values");
        }
        const blog = await Blog.findById(commentInput._blogId);
        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }

        const comment = {
          author: commentInput.author,
          comment: commentInput.comment,
          _id: mongoDb.ObjectId(),
        };
        blog.comment.push(comment);
        await blog.save();
        const commentCreated = blog.comment.find(
          (com) => com._id === comment._id
        );
        return {
          ...commentCreated._doc,
          comment: commentCreated.comment,
          _id: commentCreated._id,
          author: commentCreated.author,
          createdAt: commentCreated.createdAt.toISOString(),
          updatedAt: commentCreated.updatedAt.toISOString(),
        };
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        throw err;
      }
    },

    deleteComment: async function (parent ,{ blogid, commentid },req) {
      try {
        const blog = await Blog.findById(blogid);
        if (!blog) {
          const error = new Error("No blog found");
          error.statusCode = 404;
          throw error;
        }

        const comment = blog.comment.find(
          (c) => c._id.toString() === commentid
        );
        if (!comment) {
          const error = new Error("No comment found");
          error.statusCode = 404;
          throw error;
        }
        blog.comment.pull(comment);
        await blog.save();
        return true;
      } catch (err) {
        err.stausCode = err.statusCode || 500;
        throw err;
      }
    },

    createReply: async function (parent ,{ replyInput },req) {
      try {
        
        const errors =[];
        if(validator.isEmpty(replyInput.reply) || !validator.isLength(replyInput.reply , {min:10 , max:200})){
          errors.push({message:"Invalid input"})
        }
        if(validator.isEmpty(replyInput.author)){
          errors.push({message:"Invalid input"})
        }
       
        if(errors.length >0){
          throw new UserInputError("Invalid input values");
        }
        const blog = await Blog.findById(replyInput._blogId);

        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }

        const comment = blog.comment.find(
          (c) => c._id.toString() === replyInput._commentID
        );

        if (!comment) {
          const error = new Error("comment not found");
          error.statusCode = 404;
          throw error;
        }
        const reply = {
          reply: replyInput.reply,
          author: replyInput.author,
          _id: mongoDb.ObjectId(),
        };
        comment.reply.push(reply);

        await blog.save();

        const Createdreply = comment.reply.find((r) => r._id === reply._id);

        return {
          ...Createdreply._doc,
          reply: Createdreply.reply,
          _id: Createdreply._id.toString(),
          author: Createdreply.author,
          createdAt: Createdreply.createdAt.toISOString(),
          updatedAt: Createdreply.updatedAt.toISOString(),
        };
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        throw err;
      }
    },
    increaseLikes: async function (parent ,{ blogid },req) {
      try {
        console.log(blogid);
        const blog = await Blog.findById(blogid);
        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }

        blog.likes++;
        await blog.save();

        return true;
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
    decreaseLikes: async function (parent ,{ blogid },req) {
      try {
        const blog = await Blog.findById(blogid);
        if (!blog) {
          const error = new Error("Blog not found");
          error.statusCode = 404;
          throw error;
        }

        if (blog.likes === 0) {
          blog.likes = 0;
        } else {
          blog.likes--;
        }

        await blog.save();

        return true;
      } catch (err) {
        err.statusCode = err.statusCode || 500;
        throw err;
      }
    },
  },
};