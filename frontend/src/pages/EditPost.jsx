import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';
import { Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostAndCategories = async () => {
            try {
                const { data: postData } = await api.get(`/posts/${id}`); // Assuming we add a GET by ID route or use current posts list logic
                // If GET /posts/:id doesn't exist, we might need to use search by ID in posts array or add the endpoint
                // Let's assume we have it or add it to backend. We added CRUD routes in posts.js

                setTitle(postData.title);
                setContent(postData.content);
                setCategory(postData.category?._id || postData.category || '');
                setImage(postData.image);

                const { data: catData } = await api.get('/categories');
                setCategories(catData);
            } catch (err) {
                setError('Veriler yüklenemedi');
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndCategories();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await api.post('/upload', formData, config);
            setImage(data.image);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setError('Görsel yükleme hatası');
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/posts/${id}`, { title, content, category, image });
            navigate(`/post/${id}`); // We might want to use slug here but for ID is easier to redirect
        } catch (err) {
            setError(err.response?.data?.message || 'Güncelleme başarısız');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Yükleniyor...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
            >
                <ArrowLeft size={20} /> Geri Dön
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ImageIcon color="var(--primary-color)" /> Yazıyı Düzenle
                </h2>

                {error && <div style={{ padding: '0.75rem', marginBottom: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '0.375rem', border: '1px solid var(--danger-color)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Yazı Başlığı</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ fontSize: '1.25rem', padding: '0.75rem' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Kategori</label>
                            <select
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Kategori Seçin</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Kapak Görseli</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="URL veya dosya yükleyin"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                                <label className="btn" style={{ padding: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                                    <ImageIcon size={20} />
                                    <input type="file" hidden onChange={uploadFileHandler} />
                                </label>
                            </div>
                            {uploading && <small style={{ color: 'var(--primary-color)' }}>Yükleniyor...</small>}
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '4rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>İçerik</label>
                        <div style={{ height: '400px', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                style={{ height: '350px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>İptal</button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Kaydediliyor...' : <><Save size={18} style={{ display: 'inline', marginRight: '0.5rem' }} /> Değişiklikleri Kaydet</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;
