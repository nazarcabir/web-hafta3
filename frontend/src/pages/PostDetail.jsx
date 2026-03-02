import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Clock, User, ArrowLeft, Heart, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const PostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/posts/by-slug/${slug}`);
                setPost(data);
                setLikeCount(data.likes.length);
                if (user) {
                    setIsLiked(data.likes.includes(user._id));
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Yazı bulunamadı');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, user]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const { data } = await api.put(`/posts/${post._id}/like`);
            setLikeCount(data.length);
            setIsLiked(!isLiked);
        } catch (err) {
            console.error('Beğeni işlemi başarısız:', err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            try {
                await api.delete(`/posts/${post._id}`);
                navigate('/');
            } catch (err) {
                alert('Silme işlemi başarısız');
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;
    if (error) return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ color: 'var(--danger-color)' }}>{error}</h2>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Ana Sayfaya Dön</Link>
        </div>
    );

    return (
        <article style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}
            >
                <ArrowLeft size={20} /> Geri Dön
            </button>

            {post.image && (
                <div style={{ width: '100%', height: '400px', borderRadius: '1rem', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow)' }}>
                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    {post.category && (
                        <span style={{
                            fontSize: '0.875rem',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--primary-color)',
                            borderRadius: '1rem',
                            fontWeight: '500'
                        }}>
                            {post.category.name}
                        </span>
                    )}
                </div>
                <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1.5rem' }}>{post.title}</h1>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {post.author.profilePic ? (
                            <img src={post.author.profilePic} style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt={post.author.username} />
                        ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="var(--text-secondary)" />
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: '600' }}>{post.author.username}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={14} /> {format(new Date(post.createdAt), 'd MMMM yyyy HH:mm', { locale: tr })}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {(user?._id === post.author._id || user?.role === 'admin') && (
                            <>
                                <Link to={`/edit-post/${post._id}`} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                                    <Edit size={18} /> Düzenle
                                </Link>
                                <button onClick={handleDelete} className="btn btn-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Trash2 size={18} /> Sil
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div
                className="post-content"
                style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '4rem' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div style={{ display: 'flex', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '4rem' }}>
                <button
                    onClick={handleLike}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: isLiked ? '1px solid var(--danger-color)' : '1px solid var(--border-color)',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '2rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: isLiked ? 'var(--danger-color)' : 'var(--text-primary)',
                        backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                    }}
                >
                    <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                    <span style={{ fontWeight: '600' }}>{likeCount} Beğeni</span>
                </button>
            </div>
        </article >
    );
};

export default PostDetail;
