import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 sm:p-8 font-sans">
            <Head title="Register" />

            <div className="w-full max-w-5xl bg-[#f4f1ea] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                
                {/* Left Panel: Branding & Plant Image */}
                <div className="md:w-1/2 relative min-h-[300px] md:min-h-[600px] bg-[#f4f1ea] overflow-hidden flex items-center justify-center">
                    {/* Background Plant Image */}
                    <img 
                        src="/images/rubber_tree_login.png" 
                        alt="Rubber tree leaves" 
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-black/10"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <svg className="w-8 h-8 text-[#5c703b] mb-2 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.5 2C15.3 2 13.5 3.5 12.8 5.4C12.1 3.5 10.3 2 8.1 2C4.7 2 2 4.7 2 8.1C2 12.5 7.6 18.2 11.6 21.6C12.1 22 12.8 22 13.3 21.6C17.3 18.2 22.9 12.5 22.9 8.1C22.9 4.7 20.2 2 17.5 2Z" />
                        </svg>
                        <h1 className="font-serif text-5xl md:text-6xl text-[#fdfbf7] font-bold drop-shadow-lg tracking-tight">Bloom & Grow</h1>
                    </div>
                </div>

                {/* Right Panel: Registration Form */}
                <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-[#f4f1ea] relative z-10 shadow-[-10px_0_20px_-10px_rgba(0,0,0,0.1)]">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="font-serif text-3xl font-bold text-[#2d2d2d] text-center mb-8">Create an Account</h2>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="pl-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="name"
                                    isFocused={true}
                                    placeholder="Full Name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="pl-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="username"
                                    placeholder="Your Email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="pl-12 pr-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="new-password"
                                    placeholder="Password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
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

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="pl-12 pr-12 w-full h-12 rounded-full border-gray-300 shadow-sm focus:border-[#5c703b] focus:ring-[#5c703b] bg-white text-[#2d2d2d]"
                                    autoComplete="new-password"
                                    placeholder="Confirm Password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5c703b] hover:text-[#4a5d23] transition-colors focus:outline-none"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-12 flex justify-center items-center bg-[#4a5d23] hover:bg-[#3d4d1d] text-white rounded-full font-serif font-bold text-lg tracking-wide transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    Sign Up <span className="ml-2 font-sans font-light">+</span>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <Link 
                                href={route('login')} 
                                className="text-sm font-serif font-medium text-[#c25e5e] hover:text-[#a84a4a] transition-colors focus:outline-none focus:underline"
                            >
                                Already registered? Log in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
