import React from "react";
// --- Import Cloudinary ---
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format, quality } from "@cloudinary/url-gen/actions/delivery"; 
import { auto as qualityAuto } from "@cloudinary/url-gen/qualifiers/quality";  
import { auto as formatAuto } from "@cloudinary/url-gen/qualifiers/format";    
import "./index.css";

const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
let cld = null;
if (cloudName) {
    cld = new Cloudinary({
        cloud: { cloudName: cloudName },
        url: { secure: true }
    });
} else {
    console.error("BlogCard: Cloudinary Cloud Name chưa được cấu hình trong file .env!");
}
// ---

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch (e) {
        return '';
    }
};

export default function BlogCard({ blog }) {

    const publicId = blog?.coverImage;
    const blogCoverImage = (publicId && cld) ? cld.image(publicId) : null;

    if (blogCoverImage) {
        blogCoverImage
            .resize(fill().width(400).height(250).gravity('auto'))
            .delivery(format(formatAuto()))  
            .delivery(quality(qualityAuto())); 
    }

    const authorAvatarId = blog.author?.avatar;
    let authorAvatarImage = null;
    if(authorAvatarId && cld) {
        authorAvatarImage = cld.image(authorAvatarId)
                             .resize(fill().width(40).height(40).gravity('face'))
                             .delivery(format(formatAuto()))   
                             .delivery(quality(qualityAuto())); 
    }


    return (
        <div className="blog-card">
            <div className="image-container">
                {blogCoverImage ? (
                    <AdvancedImage
                        cldImg={blogCoverImage}
                        className="cover-image"
                        alt={blog.title || 'Blog cover'}
                    />
                ) : (
                    blog?.coverImage && !cld ?
                        <div className="cover-image-error">Config Error!</div> :
                        <div className="cover-image-placeholder">No Image</div>
                )}
            </div>
            <div className="content-overlay flex-column">
                <div className="content-spacer flex-grow"></div>
                <div className="content-details flex-column">
                    <div className="header flex-row">
                        <h1 className="publish-date">
                            {formatDate(blog.createdAt)}
                        </h1>
                        <div className="author-info flex-row">
                            <div className="author-image-container">
                                {authorAvatarImage ? (
                                     <AdvancedImage
                                        cldImg={authorAvatarImage}
                                        className="author-image"
                                        alt={blog.author?.fullName || 'Author'}
                                    />
                                ) : (
                                    <img
                                        src="/default-avatar.png"
                                        className="author-image"
                                        alt="author"
                                    />
                                )}
                            </div>
                            <h1 className="author-name">{blog.author?.fullName || "Unknown"}</h1>
                        </div>
                    </div>
                    <h1 className="blog-title">{blog.title || 'Untitled Blog'}</h1>
                </div>
            </div>
        </div>
    );
}