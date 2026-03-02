import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Image as ImageIcon, PlusCircle, ArrowLeft } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (err) {
                console.error('Kategoriler çekilemedi');
            }
        };
        fetchCategories();
    }, []);

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
        if (!content || content === '<p><br></p>') {
            return setError('İçerik boş olamaz');
        }

        setLoading(true);
        try {
            await api.post('/posts', { title, content, category, image });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Yazı oluşturulamadı');
        } finally {
            setLoading(false);
        }
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
                onClick={() => navigate(-1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', padding: 0 }}
            >
                <ArrowLeft size={20} /> İptal Et
            </button>

            <div className="card">
                <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <PlusCircle color="var(--primary-color)" /> Yeni Yazı Oluştur
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
                            placeholder="Yazınıza dikkat çekici bir başlık verin"
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
                                modules={modules}
                                style={{ height: '350px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Vazgeç</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Paylaşılıyor...' : 'Yazıyı Yayınla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
