'use client';

import { useState, useEffect } from 'react';
import { Search, X, Link2, Loader2, GripVertical, Plus } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featured_image_url: string | null;
    status: string;
}

interface RelatedPostsSelectorProps {
    postId: string;
    selectedPosts: string[];
    onChange: (postIds: string[]) => void;
}

export default function RelatedPostsSelector({
    postId,
    selectedPosts,
    onChange
}: RelatedPostsSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [selectedPostDetails, setSelectedPostDetails] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Fetch details for selected posts
        if (selectedPosts.length > 0) {
            fetchSelectedPostDetails();
        }
    }, [selectedPosts]);

    const fetchSelectedPostDetails = async () => {
        try {
            const res = await fetch('/api/admin/blog?limit=100');
            if (res.ok) {
                const data = await res.json();
                const selected = data.posts.filter((p: BlogPost) => selectedPosts.includes(p.id));
                setSelectedPostDetails(selected);
            }
        } catch (err) {
            console.error('Failed to fetch post details:', err);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ limit: '50', status: 'published' });
            if (search) params.append('search', search);

            const res = await fetch(`/api/admin/blog?${params}`);
            if (res.ok) {
                const data = await res.json();
                // Filter out current post and already selected posts
                setPosts(data.posts.filter((p: BlogPost) =>
                    p.id !== postId && !selectedPosts.includes(p.id)
                ));
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchPosts();
        }
    }, [isOpen, search]);

    const addPost = (post: BlogPost) => {
        onChange([...selectedPosts, post.id]);
        setSelectedPostDetails(prev => [...prev, post]);
        setPosts(prev => prev.filter(p => p.id !== post.id));
    };

    const removePost = (postId: string) => {
        onChange(selectedPosts.filter(id => id !== postId));
        setSelectedPostDetails(prev => prev.filter(p => p.id !== postId));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Related Posts
                </h3>
                <button
                    onClick={() => setIsOpen(true)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" />
                    Add
                </button>
            </div>

            {/* Selected Posts */}
            {selectedPostDetails.length > 0 ? (
                <div className="space-y-2">
                    {selectedPostDetails.map((post, index) => (
                        <div
                            key={post.id}
                            className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group"
                        >
                            <GripVertical className="w-4 h-4 text-muted-foreground/50 cursor-grab" />
                            {post.featured_image_url && (
                                <img
                                    src={post.featured_image_url}
                                    alt=""
                                    className="w-10 h-10 rounded object-cover"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {post.title}
                                </p>
                            </div>
                            <button
                                onClick={() => removePost(post.id)}
                                className="p-1 hover:bg-destructive/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3.5 h-3.5 text-destructive" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground py-2">
                    No related posts selected
                </p>
            )}

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

                    <div className="relative bg-background border border-border rounded-2xl w-full max-w-lg max-h-[70vh] overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-semibold">Add Related Posts</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-border/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="p-4 overflow-y-auto max-h-[40vh]">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : posts.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    {search ? 'No posts found' : 'No more posts available'}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {posts.map((post) => (
                                        <button
                                            key={post.id}
                                            onClick={() => addPost(post)}
                                            className="w-full flex items-center gap-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg text-left transition-colors"
                                        >
                                            {post.featured_image_url && (
                                                <img
                                                    src={post.featured_image_url}
                                                    alt=""
                                                    className="w-12 h-12 rounded object-cover shrink-0"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-foreground line-clamp-1">
                                                    {post.title}
                                                </p>
                                                {post.excerpt && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                            <Plus className="w-4 h-4 text-primary shrink-0" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end p-4 border-t border-border bg-muted/30">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
