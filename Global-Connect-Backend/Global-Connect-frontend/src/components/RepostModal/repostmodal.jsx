import React, { useState } from 'react';
import Modal from '../Modal/modal';
import Card from '../Card/card';
import RepeatIcon from '@mui/icons-material/Repeat';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';

const RepostModal = ({ isOpen, onClose, post, personalData, onRepost }) => {
    const [thoughts, setThoughts] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (repostType) => {
        if (repostType === 'withThoughts' && thoughts.trim().length === 0) {
            toast.error('Please add your thoughts before reposting');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const payload = {
                postId: post._id,
                repostType: repostType
            };

            if (repostType === 'withThoughts') {
                payload.thoughts = thoughts.trim();
            }

            const response = await axios.post('https://globalconnectfinalproject.onrender.com/api/post/repost', payload, {
                withCredentials: true
            });

            toast.success(
                repostType === 'withThoughts' 
                    ? 'Post reposted with your thoughts!' 
                    : 'Post reposted successfully!'
            );

            if (onRepost) {
                onRepost(response.data);
            }

            onClose();
            setThoughts('');

        } catch (err) {
            console.error('Repost error:', err);
            toast.error(err?.response?.data?.message || 'Failed to repost');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !post) return null;

    return (
        <Modal closeModal={onClose} title="">
            <div className="w-full max-w-lg mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Share this post</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Your profile info */}
                <div className="flex items-center gap-3 mb-4">
                    <img 
                        src={personalData?.profilePic || '/default-avatar.png'} 
                        alt={personalData?.f_name || 'You'}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                        onError={(e) => { e.target.src = '/default-avatar.png' }}
                    />
                    <div>
                        <div className="font-medium">{personalData?.f_name || 'You'}</div>
                        <div className="text-sm text-gray-500">Share to your network</div>
                    </div>
                </div>

                {/* Thoughts input */}
                <div className="mb-4">
                    <textarea
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        placeholder="Add your thoughts about this post..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"
                        maxLength="500"
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                        {thoughts.length}/500
                    </div>
                </div>

                {/* Original post preview */}
                <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">Original Post:</div>
                    <Card padding={1}>
                        <div className="flex items-center gap-3 mb-3">
                            <img 
                                src={post.user?.profilePic || '/default-avatar.png'} 
                                alt={post.user?.f_name || 'User'}
                                className="w-10 h-10 rounded-full"
                                onError={(e) => { e.target.src = '/default-avatar.png' }}
                            />
                            <div>
                                <div className="font-medium text-sm">{post.user?.f_name || 'Unknown User'}</div>
                                <div className="text-xs text-gray-500">{post.user?.headline || ''}</div>
                            </div>
                        </div>
                        
                        {post.desc && (
                            <div className="text-sm mb-3 line-clamp-3">
                                {post.desc.length > 100 ? `${post.desc.substring(0, 100)}...` : post.desc}
                            </div>
                        )}
                        
                        {post.imageLink && (
                            <div className="w-full h-32 rounded-lg overflow-hidden">
                                <img 
                                    src={post.imageLink} 
                                    alt="Post content"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                            </div>
                        )}
                    </Card>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSubmit('direct')}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RepeatIcon sx={{ fontSize: 18 }} />
                        {isSubmitting ? 'Reposting...' : 'Repost'}
                    </button>
                    
                    <button
                        onClick={() => handleSubmit('withThoughts')}
                        disabled={isSubmitting || thoughts.trim().length === 0}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RepeatIcon sx={{ fontSize: 18 }} />
                        {isSubmitting ? 'Sharing...' : 'Share with thoughts'}
                    </button>
                </div>

                {/* Quick repost options */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Quick actions:</div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setThoughts("Great insights! 👍");
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                            + Great insights!
                        </button>
                        <button
                            onClick={() => {
                                setThoughts("Thanks for sharing this! 🙌");
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                            + Thanks for sharing
                        </button>
                        <button
                            onClick={() => {
                                setThoughts("This is really helpful! 💡");
                            }}
                            className="px-3 py-1 text-xs bg-gray-100 rounded-full hover:bg-gray-200"
                        >
                            + Really helpful
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RepostModal;
