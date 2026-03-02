import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';
import { User as UserIcon, Settings, Image as ImageIcon } from 'lucide-react';

const Dashboard = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profilePic, setProfilePic] = useState(user?.profilePic || '');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/auth/me/profile', { username, email, profilePic });
            updateUser(data);
            setMessage({ text: 'Profil başarıyla güncellendi', type: 'success' });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || 'Güncelleme başarısız', type: 'error' });
        }
    };

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
            setProfilePic(data.image);
            setUploading(false);
            setMessage({ text: 'Görsel başarıyla yüklendi', type: 'success' });
        } catch (error) {
            console.error(error);
            setUploading(false);
            setMessage({ text: error.response?.data?.message || 'Görsel yüklenemedi', type: 'error' });
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <UserIcon size={32} color="var(--primary-color)" />
                <h2>Kullanıcı Paneli</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Settings size={20} color="var(--primary-color)" />
                        <h3 style={{ margin: 0 }}>Profil Ayarları</h3>
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            color: message.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)',
                            borderRadius: '0.375rem',
                            border: `1px solid ${message.type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ flex: '0 0 100px' }}>
                                {profilePic ? (
                                    <img
                                        src={profilePic}
                                        alt="Profil"
                                        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                                    />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)' }}>
                                        <UserIcon size={40} color="var(--text-secondary)" />
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Profil Fotoğrafı <ImageIcon size={14} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Görsel URL'si (İsteğe bağlı)"
                                        value={profilePic}
                                        onChange={(e) => setProfilePic(e.target.value)}
                                        style={{ marginBottom: '0.5rem' }}
                                    />
                                    <input
                                        type="file"
                                        id="image-file"
                                        onChange={uploadFileHandler}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            padding: '0.375rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--text-secondary)'
                                        }}
                                    />
                                    {uploading && <small style={{ color: 'var(--primary-color)' }}>Yükleniyor...</small>}
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Kullanıcı Adı</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>E-posta</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary">Bilgileri Güncelle</button>
                        </div>
                    </form>
                </div>

                {user?.role === 'admin' && (
                    <div className="card" style={{ borderLeft: '4px solid var(--primary-color)' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Yönetici Araçları</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Admin yetkilerine sahipsiniz. Kategorileri ve tüm yazıları düzenleyebilirsiniz.
                        </p>
                        {/* Note: In a complete system we'd add category management views here. Since the document didn't ask for full admin UI pages, we leave this as a placeholder or can build it next. */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/create-post" className="btn btn-primary" style={{ flex: 1 }}>Yeni Yazı Ekle</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
