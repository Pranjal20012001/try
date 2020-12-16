const mongoose = require('mongoose')


const pendingSchema = new mongoose.Schema ({
         title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        author:  {
            type: String,
            required: true
        }
}, {timestamps: true}
   ) ;

const ApprovedSchema = new mongoose.Schema ({
	 title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        author:  {
            type: String,
            required: true
        }
}, {timestamps: true}) ;

const Pending = mongoose.model("Pending",pendingSchema);
const Approved = mongoose.model("Approved",ApprovedSchema);

module.exports = Blog;
