import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 sm:p-8 font-sans">
            <Head title="Log in" />

            <div className="w-full max-w-5xl bg-[#f4f1ea] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                
                {/* Left Panel: Branding & Plant Image */}
                <div className="md:w-1/2 relative min-h-[300px] md:min-h-[600px] bg-[#f4f1ea] overflow-hidden flex items-center justify-center">
                    {/* Background Plant Image */}
                    <img 
                        src="/images/rubber_tree_login.png" 
                        alt="Rubber tree leaves" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    
                    {/* Dark gradient overlay for text readability (optional, but good for white text) */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <svg className="w-8 h-8 text-[#5c703b] mb-2 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.5 2C15.3 2 13.5 3.5 12.8 5.4C12.1 3.5 10.3 2 8.1 2C4.7 2 2 4.7 2 8.1C2 12.5 7.6 18.2 11.6 21.6C12.1 22 12.8 22 13.3 21.6C17.3 18.2 22.9 12.5 22.9 8.1C22.9 4.7 20.2 2 17.5 2Z" />
                        </svg>
                        <h1 className="font-serif text-5xl md:text-6xl text-[#fdfbf7] font-bold drop-shadow-lg tracking-tight">Bloom & Grow</h1>
                    </div>
                </div>

                {/* Right Panel: Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#f4f1ea] relative z-10 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)]">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="font-serif text-4xl font-bold text-[#2d2d2d] text-center mb-10">Log In</h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="username"
                                    isFocused={true}
                                    placeholder="Your Email"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="pl-12 pr-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5c703b] hover:text-[#4a5d23] transition-colors focus:outline-none"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-5 h-5 border-gray-300 rounded text-[#c25e5e] focus:ring-[#c25e5e] shadow-sm transition-colors cursor-pointer"
                                        />
                                    </div>
                                    <span className="ml-3 text-sm font-serif text-gray-600 group-hover:text-gray-800 transition-colors">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-serif font-medium text-[#c25e5e] hover:text-[#a84a4a] transition-colors focus:outline-none focus:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 flex justify-center items-center bg-[#4a5d23] hover:bg-[#3d4d1d] text-white rounded-full font-serif font-bold text-lg tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    Log In <span className="ml-2 font-sans font-light">+</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-10">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#f4f1ea] font-serif text-[#c25e5e]">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center space-x-6">
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1877F2] hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors">
                                    <span className="sr-only">Sign in with Facebook</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>

                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors">
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </a>

                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0A66C2] hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors">
                                    <span className="sr-only">Sign in with LinkedIn</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>

                            <div className="mt-8 text-center">
                                <Link href={route('register')} className="text-sm font-serif font-medium text-[#c25e5e] hover:text-[#a84a4a] transition-colors focus:outline-none focus:underline">
                                    New to Bloom & Grow? Or sign up here
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
