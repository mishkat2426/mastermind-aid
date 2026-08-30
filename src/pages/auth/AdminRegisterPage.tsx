// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { ArrowRight, BrainCircuit, AlertCircle } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { AIOrb } from '../../components/ai/AIOrb';

// export const AdminRegisterPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { registerAdmin, isLoading } = useAuth();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [securityCode, setSecurityCode] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');

//   const handleRegisterSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorMsg('');

//     if (!name.trim() || !email.trim() || !securityCode.trim() || !password.trim() || !confirmPassword.trim()) {
//       setErrorMsg('Please fill in all registration fields.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       setErrorMsg('Passwords do not match. Please re-enter your password.');
//       return;
//     }

//     if (password.length < 6) {
//       setErrorMsg('Password must be at least 6 characters long.');
//       return;
//     }

//     const result = await registerAdmin(name, email, password, securityCode);
//     if (result.success && result.user) {
//       navigate('/admin/dashboard');
//     } else {
//       setErrorMsg(result.error || 'Admin registration failed. Please check your credentials.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
//       <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

//       <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
//         <Link to="/" className="inline-flex items-center gap-3 justify-center">
//           <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-xl shadow-brand-500/30">
//             <BrainCircuit className="w-7 h-7 stroke-[2.5]" />
//           </div>
//           <span className="text-base sm:text-xl font-black tracking-tight leading-none">
//             Mastermind <span className="text-brand-400">AidlT</span>
//           </span>
//         </Link>
//         <div>
//           <h2 className="text-2xl font-black">Admin Registration</h2>
//           <p className="text-xs text-slate-400 font-medium">
//             Create a new administrator account using your system security code.
//           </p>
//         </div>
//       </div>

//       <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
//         <div className="bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
          
//           <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
//             <div>
//               <label className="block text-xs font-bold text-slate-300 mb-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 required
//                 placeholder="Tanvir Ahmed"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-300 mb-1">
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 required
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-300 mb-1">
//                 Admin Security Code
//               </label>
//               <input
//                 type="password"
//                 required
//                 placeholder="Enter system security code"
//                 value={securityCode}
//                 onChange={(e) => setSecurityCode(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-300 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-slate-300 mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 required
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
//               />
//             </div>

//             {errorMsg && (
//               <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 font-bold flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
//                 <span>{errorMsg}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
//             >
//               {isLoading ? (
//                 <div className="flex items-center gap-2">
//                   <AIOrb state="thinking" size={20} />
//                   <span>Registering Admin...</span>
//                 </div>
//               ) : (
//                 <>
//                   <span>Create Admin Account</span>
//                   <ArrowRight className="w-4 h-4" />
//                 </>
//               )}
//             </button>

//           </form>

//           <div className="text-center pt-2 text-xs text-slate-400 font-medium border-t border-slate-800">
//             Already have an account?{' '}
//             <Link to="/login" className="font-extrabold text-brand-400 hover:underline">
//               Log In
//             </Link>
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// };
// export default AdminRegisterPage;
