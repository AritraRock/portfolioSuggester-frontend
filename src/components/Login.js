// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/v1/users/login', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle success response
            if (response.status === 200) {
                alert('Login successful!');
                // Store auth tokens (could be JWT tokens)
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                setFormData({
                    email: '',
                    password: ''
                });

                navigate('/home');
            }
        } catch (error) {
            // Handle error response
            alert('Login failed: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-300">
            <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                        required
                    />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg mb-4 hover:bg-blue-700 transition duration-200">Login</button>

                <div className="flex flex-col items-center text-sm">
                    <div className="text-center mb-2">Don't have an account?</div>
                    <div>
                        <a 
                        href="/register" 
                        className="text-blue-600 font-semibold hover:text-blue-700 transition duration-200"
                        >
                        Sign Up
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Login;
