import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Input, Label } from 'reactstrap';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import '../../styles/profile.css'; 

const Profile = () => {
    const { user, dispatch } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        photo: user?.photo || ''
    });

    const [message, setMessage] = useState('');

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${BASE_URL}/users/${user._id}`, {
                method: 'put',
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const result = await res.json();

            if (!res.ok) {
                return alert(result.message);
            }

            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
            
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);

        } catch (err) {
            alert(err.message);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <section className="mt-5 mb-5 pb-5 profile__section">
            <Container>
                <Row>
                    <Col lg="6" className="m-auto">
                        <div className="profile__container">
                            <div className="text-center">
                                <img 
                                    src={formData.photo || defaultAvatar} 
                                    alt="Avatar" 
                                    className="avatar__preview"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
                                />
                                <h2 className="profile__title">My Profile</h2>
                                <p className="profile__subtitle">Personalized experience and updates</p>
                            </div>

                            {message && <div className="profile__alert alert p-3 text-center mb-4">{message}</div>}

                            <Form onSubmit={handleSubmit} className="profile__form">
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <Input
                                        type="text"
                                        placeholder="Choose a cool username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="email">Email Address</Label>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="photo">Upload Avatar Image</Label>
                                    <div className="custom-file-upload">
                                        <Input
                                            type="file"
                                            id="photo_upload"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="d-none"
                                        />
                                        <label htmlFor="photo_upload" className="btn btn-outline-light w-100 py-2" style={{ borderRadius: '0.8rem', cursor: 'pointer' }}>
                                            📷 Browse Image
                                        </label>
                                    </div>
                                </FormGroup>
                                <Button className="profile__btn w-100 mt-3" type="submit">
                                    💾 Save Changes
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Profile;
