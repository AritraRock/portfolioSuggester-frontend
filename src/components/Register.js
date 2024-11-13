// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        age: '',
        income: ''
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
            const response = await axios.post('http://localhost:8000/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Handle success response
            if (response.status === 200) {
                alert('User registered successfully!');
                setFormData({
                    fullname: '',
                    email: '',
                    password: '',
                    age: '',
                    income: ''
                });
            }
        } catch (error) {
            // Handle error response
            alert('Registration failed: ' + error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <form className="bg-white p-6 rounded-lg shadow-lg w-[26rem]" onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                <div className="mb-4">
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                />
                </div>

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

                <div className="mb-4">
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

                <div className="mb-4">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                />
                </div>

                <div className="mb-6">
                <label htmlFor="income" className="block text-sm font-medium text-gray-700">Income</label>
                <input
                    type="number"
                    id="income"
                    name="income"
                    value={formData.income}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border border-gray-300 rounded"
                    required
                />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg mb-4 hover:bg-blue-700 transition duration-200">
                Register
                </button>

                <div className="flex flex-col items-center text-sm">
                    <div className="text-center mb-2">Already registered?</div>
                    <div>
                        <a 
                        href="/login" 
                        className="text-blue-600 font-semibold hover:text-blue-700 transition duration-200"
                        >
                        Sign in
                        </a>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default Register;
