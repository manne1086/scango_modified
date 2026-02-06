
import React, { useState, useRef, useEffect } from 'react';
import {
  Lock,
  LogOut,
  ShieldCheck,
  Banknote,
  ScanLine,
  XCircle,
  AlertTriangle,
  ChevronRight,
  User,
  History,
  ArrowLeft,
  WifiOff
} from 'lucide-react';
// @ts-ignore
import jsQR from 'jsqr';
import { Employee, Role, AppScreen, CashierResult, GuardResult } from './types';
import { authApi, cashierApi, guardApi } from './services/apiService';

// --- SHARED COMPONENTS ---

const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black flex justify-center">
    <div className="w-full max-w-md bg-gray-900 shadow-2xl relative flex flex-col overflow-hidden">
      {children}
    </div>
  </div>
);

const Scanner: React.FC<{
  onScan: (val: string) => void;
  label: string;
  color: string;
  isProcessing: boolean;
}> = ({ onScan, label, color, isProcessing }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    let animationId: number;

    const start = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("CAMERA_NOT_SUPPORTED"); // Likely non-HTTPS context
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.error("Video play failed", playErr);
          }

          const scan = () => {
            if (isProcessing) {
              animationId = requestAnimationFrame(scan);
              return;
            }
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              const canvas = document.createElement("canvas");
              canvas.width = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              const ctx = canvas.getContext("2d");

              if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                  inversionAttempts: "dontInvert",
                });
                if (code && code.data) onScan(code.data);
              }
            }
            animationId = requestAnimationFrame(scan);
          };
          scan();
        }
      } catch (e: any) {
        console.error("Camera error:", e);
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          setError("PERMISSION_DENIED");
        } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
          setError("NO_CAMERA_FOUND");
        } else {
          setError("CAMERA_ERROR");
        }
      }
    };

    start();
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [onScan]);

  const renderError = () => {
    if (!error) return null;

    const messages: Record<string, { title: string; desc: string }> = {
      CAMERA_NOT_SUPPORTED: {
        title: "Secure Context Required",
        desc: "Camera access requires HTTPS. Please ensure you are using the HTTPS ngrok URL."
      },
      PERMISSION_DENIED: {
        title: "Permission Denied",
        desc: "Please allow camera access in your browser settings and refresh."
      },
      NO_CAMERA_FOUND: {
        title: "No Camera Found",
        desc: "We couldn't detect a camera on this device."
      },
      CAMERA_ERROR: {
        title: "Camera Error",
        desc: "An unexpected error occurred while accessing the camera."
      }
    };

    const msg = messages[error] || messages.CAMERA_ERROR;

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50 p-6 text-center">
        <div className="text-white">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">{msg.title}</h3>
          <p className="text-gray-400 text-sm">{msg.desc}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex-1 bg-black overflow-hidden">
      {renderError()}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        autoPlay
        playsInline
        muted
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className={`w-64 h-64 border-4 rounded-3xl relative animate-pulse`} style={{ borderColor: color }}>
          <div className="absolute inset-0 flex items-center justify-center"><ScanLine className="w-full h-1 animate-ping" style={{ color }} /></div>
        </div>
        <div className="mt-8 bg-black/60 backdrop-blur px-6 py-2 rounded-full border border-white/10">
          <p className="font-bold tracking-widest text-xs" style={{ color }}>{isProcessing ? 'PROCESSING...' : label}</p>
        </div>
      </div>
    </div>
  );
};

// --- SCREENS ---

const LoginScreen: React.FC<{ onLogin: (e: Employee) => void }> = ({ onLogin }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const emp = await authApi.login(id, pass);
    setLoading(false);
    if (emp) onLogin(emp); else alert('Invalid Credentials');
  };

  return (
    <div className="flex-1 bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="w-full bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-900/50"><User size={32} className="text-white" /></div>
        </div>
        <h1 className="text-2xl font-black text-white text-center mb-1">Staff Portal</h1>
        <p className="text-gray-400 text-center text-sm mb-8">ScanGo Enterprise Terminal</p>
        <div className="mb-4 p-2 bg-black/20 rounded text-[10px] text-gray-500 font-mono break-all text-center">
          API: {import.meta.env.VITE_BACKEND_URL || (process.env as any).VITE_BACKEND_URL || 'http://localhost:5000'}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={id} onChange={e => setId(e.target.value)} placeholder="Employee ID" className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" className="w-full bg-gray-900 border border-gray-600 rounded-xl p-4 text-white focus:border-blue-500 outline-none" />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl mt-4 transition-all active:scale-95 disabled:opacity-50">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const RoleSelectScreen: React.FC<{ onSelect: (r: Role) => void; onLogout: () => void; name: string }> = ({ onSelect, onLogout, name }) => (
  <div className="flex-1 bg-gray-50 flex flex-col p-6">
    <div className="flex justify-between items-center mb-8 pt-4">
      <div><h2 className="text-2xl font-black text-gray-800">Welcome,</h2><p className="text-gray-500 font-medium">{name}</p></div>
      <button onClick={onLogout} className="p-2 bg-white rounded-xl shadow-sm border text-gray-400 hover:text-red-500"><LogOut size={20} /></button>
    </div>
    <div className="flex-1 flex flex-col justify-center gap-6 pb-12">
      <button onClick={() => onSelect('CASHIER')} className="bg-white p-6 rounded-3xl shadow-xl border-l-8 border-yellow-400 hover:scale-[1.02] transition-transform text-left group">
        <div className="bg-yellow-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors"><Banknote size={24} className="text-yellow-700 group-hover:text-white" /></div>
        <h3 className="text-lg font-black text-gray-800">Cashier Mode</h3>
        <p className="text-gray-400 text-xs mt-1">Accept cash payments and authorize blockchain transactions.</p>
        <div className="mt-4 flex items-center text-yellow-600 font-bold text-xs">Start Shift <ChevronRight size={14} /></div>
      </button>

      <button onClick={() => onSelect('GUARD')} className="bg-white p-6 rounded-3xl shadow-xl border-l-8 border-green-600 hover:scale-[1.02] transition-transform text-left group">
        <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors"><ShieldCheck size={24} className="text-green-700 group-hover:text-white" /></div>
        <h3 className="text-lg font-black text-gray-800">Guard Mode</h3>
        <p className="text-gray-400 text-xs mt-1">Verify proof-of-payment at exit gates securely.</p>
        <div className="mt-4 flex items-center text-green-600 font-bold text-xs">Start Shift <ChevronRight size={14} /></div>
      </button>
    </div>
  </div>
);

// --- WORKFLOW CONTAINER ---

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('LOGIN');
  const [user, setUser] = useState<Employee | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const [cashierRes, setCashierRes] = useState<CashierResult | null>(null);
  const [guardRes, setGuardRes] = useState<GuardResult | null>(null);

  const handleLogout = () => { setUser(null); setRole(null); setScreen('LOGIN'); };
  const handleEndShift = () => { setRole(null); setScreen('ROLE_SELECT'); };

  const handleScan = async (payload: string) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);

    // 🛡️ PARSE QR PAYLOAD (IT'S A JSON STRING)
    let orderHash = payload;
    let receiptNumber = '';

    try {
      const data = JSON.parse(payload);
      if (data.orderHash) {
        orderHash = data.orderHash;
      }
      if (data.receiptNumber) {
        receiptNumber = data.receiptNumber;
      }
    } catch (e) {
      // Fallback: Use raw payload if not valid JSON
      console.log('Using raw payload as hash');
    }

    if (role === 'CASHIER') {
      const res = await cashierApi.markOrderPaid(orderHash, receiptNumber);
      setCashierRes(res);
      setScreen('RESULT');
    } else if (role === 'GUARD') {
      const res = await guardApi.verifyExit(orderHash, receiptNumber);
      setGuardRes(res);
      setScreen('RESULT');
    }
    setProcessing(false);
    processingRef.current = false;
  };

  const resetScanner = () => {
    setCashierRes(null);
    setGuardRes(null);
    setScreen('SCANNER');
  };

  const renderContent = () => {
    if (screen === 'LOGIN') return <LoginScreen onLogin={(u) => { setUser(u); setScreen('ROLE_SELECT'); }} />;
    if (screen === 'ROLE_SELECT') return <RoleSelectScreen name={user?.name || ''} onLogout={handleLogout} onSelect={(r) => { setRole(r); setScreen('SCANNER'); }} />;

    const themeColor = role === 'CASHIER' ? '#FACC15' : '#16A34A';

    return (
      <div className="flex-1 flex flex-col h-full bg-gray-900">
        <div className="relative z-50 bg-gray-800 p-4 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <button onClick={handleEndShift} className="p-1 rounded-full text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
              {role === 'CASHIER' ? <Banknote size={18} /> : <ShieldCheck size={18} />}
            </div>
            <div>
              <h2 className="font-bold text-xs leading-tight">{role === 'CASHIER' ? 'CASHIER' : 'GUARD'}</h2>
              <p className="text-[10px] text-gray-400">{user?.name}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 p-1">
            <LogOut size={18} />
          </button>
        </div>

        <div className="flex-1 relative flex flex-col overflow-hidden">
          {screen === 'SCANNER' && (
            <Scanner label={role === 'CASHIER' ? 'SCAN TO PAY' : 'SCAN TO VERIFY'} color={themeColor} onScan={handleScan} isProcessing={processing} />
          )}

          {screen === 'RESULT' && (
            <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300 ${(cashierRes?.success || guardRes?.allowed) ? 'bg-green-600' :
              (guardRes?.status === 'NETWORK_ERROR' || cashierRes?.status === 'NETWORK_ERROR') ? 'bg-orange-600' : 'bg-red-600'
              }`}>
              <div className="bg-white p-4 rounded-full shadow-2xl mb-6 w-24 h-24 flex items-center justify-center relative">
                {(cashierRes?.success || guardRes?.allowed) ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-green-100 animate-circle-pop"></div>
                    <svg className="w-12 h-12 relative z-10" viewBox="0 0 52 52">
                      <path
                        className="animate-check-draw fill-none stroke-[5px] stroke-green-600"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  (guardRes?.status === 'NETWORK_ERROR' || cashierRes?.status === 'NETWORK_ERROR') ? (
                    <WifiOff size={48} className="text-orange-600" />
                  ) : (
                    <XCircle size={48} className="text-red-600" />
                  )
                )}
              </div>
              <h1 className="text-2xl font-black mb-1">
                {role === 'CASHIER' ? (
                  cashierRes?.success ? 'PAYMENT RECEIVED' :
                    (cashierRes?.status === 'NETWORK_ERROR' ? 'CONNECTION FAILED' : 'PAYMENT FAILED')
                ) : (
                  guardRes?.allowed ? 'EXIT ALLOWED' :
                    (guardRes?.status === 'NETWORK_ERROR' ? 'NETWORK ERROR' : 'ACCESS DENIED')
                )}
              </h1>
              <p className="text-white/80 font-bold text-xs mb-8 uppercase tracking-widest">
                {role === 'CASHIER' ? cashierRes?.status.replace('_', ' ') : guardRes?.status.replace('_', ' ')}
              </p>
              <div className="bg-black/20 rounded-xl p-4 w-full backdrop-blur border border-white/10 mb-8">
                <p className="text-[10px] text-white/50 font-mono mb-1">HASH ID</p>
                <p className="font-mono text-[10px] break-all opacity-90">{cashierRes?.orderHash || guardRes?.orderHash}</p>
              </div>
              <button onClick={resetScanner} className="bg-white text-gray-900 w-full py-4 rounded-xl font-black shadow-xl active:scale-95 transition-transform">
                SCAN NEXT
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return <MobileContainer>{renderContent()}</MobileContainer>;
};

export default App;
