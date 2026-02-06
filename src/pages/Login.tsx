import React, { useState } from 'react';
import { User as UserIcon, Lock, ArrowRight, CheckCircle2, ShoppingCart, X, Menu } from 'lucide-react';
import { otpApi, authApi } from '../services/api';
import { Employee } from '../types';
import { LOGO_URL } from '../constants';

// Refactored Login Components
const CustomerLoginForm: React.FC<{ onSuccess: (phone: string, name: string) => void }> = ({ onSuccess }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'INPUT_MOBILE' | 'INPUT_OTP'>('INPUT_MOBILE');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (phoneNumber.length < 10) {
            setError('Invalid Mobile Number');
            return;
        }

        setIsLoading(true);
        setError(null);
        const res = await otpApi.sendOtp(phoneNumber);
        setIsLoading(false);

        if (res.success) {
            setStep('INPUT_OTP');
        } else {
            setError(res.message || 'Failed to send OTP');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setIsLoading(true);
        setError(null);
        const res = await otpApi.verifyOtp(phoneNumber, otp);
        setIsLoading(false);

        if (res.success) {
            onSuccess(phoneNumber, name);
        } else {
            setError(res.message || 'Invalid OTP');
        }
    };

    return (
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl border-t-8 border-[#007041]">
            <div className="flex justify-center -mb-6">
                <img src={LOGO_URL} alt="ScanGo Logo" className="h-48 object-contain" />
            </div>

            <h1 className="text-2xl font-black text-center text-gray-800 mb-2">
                {step === 'INPUT_MOBILE' ? 'Welcome' : 'Verify Mobile'}
            </h1>
            <p className="text-center text-gray-400 text-sm mb-8 font-medium">
                {step === 'INPUT_MOBILE' ? 'Create an account to continue' : `Enter OTP sent to ${phoneNumber}`}
            </p>

            {step === 'INPUT_MOBILE' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                        <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#007041] transition">
                            <div className="bg-gray-100 px-4 py-4 border-r border-gray-200 text-gray-500 font-bold text-sm flex items-center">
                                <UserIcon size={21} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="flex-1 bg-transparent p-4 outline-none font-bold text-gray-800"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
                        <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#007041] transition">
                            <div className="bg-gray-100 px-4 py-4 border-r border-gray-200 text-gray-500 font-bold text-sm flex items-center gap-1">
                                <span>+91</span>
                            </div>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                className="flex-1 bg-transparent p-4 outline-none font-bold text-gray-800"
                                placeholder="98765 43210"
                                maxLength={10}
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#007041] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isLoading ? 'Sending...' : <>Get OTP <ArrowRight size={20} /></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">One Time Password</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-[#007041] transition"
                            placeholder="------"
                            maxLength={6}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold text-center bg-gray-100 py-1 rounded">
                        Demo Hint: Use OTP <span className="text-gray-800">123456</span>
                    </p>
                    {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#007041] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg active:scale-[0.98]"
                    >
                        {isLoading ? 'Verifying...' : 'Verify & Login'}
                    </button>
                    <button
                        type="button"
                        onClick={() => { setStep('INPUT_MOBILE'); setError(null); }}
                        className="w-full text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-[#007041] py-2"
                    >
                        Change Number
                    </button>
                </form>
            )}
            <div className="mt-8 text-center text-xs text-gray-400 font-medium">
                <p>By logging in, you agree to our</p>
                <p><span className="underline">Terms of Service</span> & <span className="underline">Privacy Policy</span></p>
            </div>
        </div>
    );
};

const EmployeeLoginForm: React.FC<{ onSuccess: (emp: Employee) => void }> = ({ onSuccess }) => {
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const emp = await authApi.login(empId, password);
            if (emp) {
                onSuccess(emp);
            } else {
                setError('Invalid Credentials');
            }
        } catch (err) {
            setError('Login Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm bg-gray-800 p-8 rounded-3xl shadow-xl border-t-8 border-[#FFD200]">
            <div className="mb-8 text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-600">
                    <Lock size={32} className="text-[#FFD200]" />
                </div>
                <h1 className="text-2xl font-black text-white">Employee Access</h1>
                <p className="text-gray-400 text-sm">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Employee ID</label>
                    <input
                        type="text"
                        value={empId}
                        onChange={(e) => setEmpId(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:border-[#007041] outline-none transition"
                        placeholder="e.g. EMP-001"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:border-[#007041] outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#007041] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg mt-6 flex items-center justify-center gap-2"
                >
                    {loading ? 'Verifying...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export const Login: React.FC<{
    onCustomerLogin: (phone: string, name: string) => void;
    onEmployeeLogin: (emp: Employee) => void;
}> = ({ onCustomerLogin, onEmployeeLogin }) => {
    const [mode, setMode] = useState<'CUSTOMER' | 'EMPLOYEE'>('CUSTOMER');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`h-screen flex flex-col relative overflow-hidden ${mode === 'EMPLOYEE' ? 'bg-gray-900' : 'bg-gray-50'}`}>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="absolute inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`absolute top-0 bottom-0 left-0 w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 bg-[#007041] text-white h-40 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShoppingCart size={120} />
                    </div>
                    <h2 className="text-2xl font-black">Login Menu</h2>
                    <p className="text-green-100 text-xs font-medium">Select your portal</p>
                    <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-4 space-y-3 mt-4">
                    <button onClick={() => { setMode('CUSTOMER'); setSidebarOpen(false); }} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${mode === 'CUSTOMER' ? 'bg-green-50 text-[#007041] shadow-sm border border-green-100 ring-2 ring-green-500/20' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <div className={`p-2 rounded-xl ${mode === 'CUSTOMER' ? 'bg-white' : 'bg-gray-100'}`}><UserIcon size={20} /></div>
                        <div className="text-left">
                            <span className="block font-black text-sm">Customer Login</span>
                            <span className="block text-[10px] opacity-70">For Shoppers</span>
                        </div>
                        {mode === 'CUSTOMER' && <CheckCircle2 size={16} className="ml-auto" />}
                    </button>
                    <button onClick={() => { setMode('EMPLOYEE'); setSidebarOpen(false); }} className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${mode === 'EMPLOYEE' ? 'bg-gray-800 text-[#FFD200] shadow-sm border border-gray-700 ring-2 ring-yellow-500/20' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <div className={`p-2 rounded-xl ${mode === 'EMPLOYEE' ? 'bg-gray-700' : 'bg-gray-100'}`}><Lock size={20} /></div>
                        <div className="text-left">
                            <span className="block font-black text-sm">Employee Login</span>
                            <span className="block text-[10px] opacity-70">For Staff Only</span>
                        </div>
                        {mode === 'EMPLOYEE' && <CheckCircle2 size={16} className="ml-auto" />}
                    </button>
                </div>
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ScanGo v1.2</p>
                </div>
            </div>

            {/* Header Toggle */}
            <div className="absolute top-4 left-4 z-30">
                <button onClick={() => setSidebarOpen(true)} className={`p-3 rounded-full shadow-lg transition-colors ${mode === 'EMPLOYEE' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                    <Menu size={24} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
                <div className="w-full flex justify-center animate-in slide-in-from-bottom-4 duration-500 fade-in">
                    {mode === 'CUSTOMER' ? (
                        <CustomerLoginForm onSuccess={onCustomerLogin} />
                    ) : (
                        <EmployeeLoginForm onSuccess={onEmployeeLogin} />
                    )}
                </div>
            </div>
        </div>
    );
};
