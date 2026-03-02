import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, User, ChevronRight, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(1);
    const [searchParams] = useSearchParams();

    const pageNumber = searchParams.get('pageNumber') || 1;
    const categoryId = searchParams.get('category') || '';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/posts?pageNumber=${pageNumber}&category=${categoryId}`);
                setPosts(data.posts);
                setPages(data.pages);
            } catch (error) {
                console.error('Yazılar yüklenirken hata oluştu:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Kategoriler yüklenirken hata oluştu:', error);
            }
        };

        fetchPosts();
        fetchCategories();
    }, [pageNumber, categoryId]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="loader">Yükleniyor...</div>
        </div>
    );

    return (
        <div>
            <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary-color), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    BEUBlog Dünyasına Hoş Geldiniz
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                    Modern teknolojilerle geliştirilmiş, fikirlerinizi paylaşabileceğiniz bir platform.
                </p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
                {/* Post List */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Son Yazılar
                    </h2>

                    {posts.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Henüz yazı paylaşılmamış.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {posts.map((post) => (
                                <article key={post._id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'row' }}>
                                    {post.image && (
                                        <div style={{ flex: '0 0 250px', height: 'auto', minHeight: '200px' }}>
                                            <img
                                                src={post.image.startsWith('http') ? post.image : post.image}
                                                alt={post.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                            {post.category && (
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    backgroundColor: 'var(--primary-color)',
                                                    color: 'white',
                                                    borderRadius: '1rem'
                                                }}>
                                                    {post.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <h3 style={{ marginBottom: '0.75rem' }}>
                                            <Link to={`/post/${post.slug}`} style={{ color: 'var(--text-primary)' }}>{post.title}</Link>
                                        </h3>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            marginBottom: '1.5rem',
                                            fontSize: '0.95rem'
                                        }}>
                                            {post.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                        </p>
                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <User size={14} /> {post.author.username}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={14} /> {format(new Date(post.createdAt), 'd MMM yyyy', { locale: tr })}
                                                </span>
                                            </div>
                                            <Link to={`/post/${post.slug}`} style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                                                Devamını Oku <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                            {[...Array(pages).keys()].map((x) => (
                                <Link
                                    key={x + 1}
                                    to={`/?pageNumber=${x + 1}${categoryId ? `&category=${categoryId}` : ''}`}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: Number(pageNumber) === x + 1 ? 'var(--primary-color)' : 'var(--card-bg)',
                                        color: Number(pageNumber) === x + 1 ? 'white' : 'var(--text-primary)',
                                        border: '1px solid var(--border-color)',
                                    }}
                                >
                                    {x + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Kategoriler</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" style={{ color: !categoryId ? 'var(--primary-color)' : 'var(--text-primary)', fontWeight: !categoryId ? '600' : '400' }}>
                                Tümü
                            </Link>
                            {categories.map((c) => (
                                <Link
                                    key={c._id}
                                    to={`/?category=${c._id}`}
                                    style={{
                                        color: categoryId === c._id ? 'var(--primary-color)' : 'var(--text-primary)',
                                        fontWeight: categoryId === c._id ? '600' : '400'
                                    }}
                                >
                                    {c.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                        <h3>Hakkımızda</h3>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.9 }}>
                            BEUBlog, fikirlerinizi özgürce paylaşabileceğiniz modern bir blog platformudur.
                        </p>
                        <button className="btn" style={{
                            marginTop: '1.5rem',
                            width: '100%',
                            backgroundColor: 'white',
                            color: 'var(--primary-color)'
                        }}>
                            Bize Katılın
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
