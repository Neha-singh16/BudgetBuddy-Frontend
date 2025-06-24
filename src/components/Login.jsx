// import React, { useState } from "react";
// import { Eye, EyeOff, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import axios from "axios";
// import { setUser } from "../utils/userSlice";
// import { USER } from "../utils/constant";

// export default function AuthPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
//   const [showPwd, setShowPwd] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const toggleShow = () => setShowPwd(s => !s);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isLogin && form.password !== form.confirm) {
//       setError('Passwords do not match');
//       return;
//     }
//     const endpoint = isLogin ? '/login' : '/signup';
//     const payload = isLogin
//       ? { email: form.email, password: form.password }
//       : { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password };
//     try {
//       const res = await axios.post(USER + endpoint, payload, { withCredentials: true });
//       dispatch(setUser(res.data));
//       navigate('/app/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'An error occurred');
//     }
//   };

//   // choose image based on mode
//   const sideImageUrl = isLogin
//     ? 'https://videos.openai.com/vg-assets/assets%2Ftask_01jxms2rsteafa8fg8yeakz4xn%2F1749822935_img_1.webp?st=2025-06-21T15%3A09%3A45Z&se=2025-06-27T16%3A09%3A45Z&sks=b&skt=2025-06-21T15%3A09%3A45Z&ske=2025-06-27T16%3A09%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=mWNfXXfNd8k7rSN%2FcSvLfehGSr9fWoSxMvFmoHEgwbs%3D&az=oaivgprodscus'
//     : 'https://videos.openai.com/vg-assets/assets%2Ftask_01jxms2rsteafa8fg8yeakz4xn%2F1749822935_img_0.webp?st=2025-06-21T15%3A09%3A45Z&se=2025-06-27T16%3A09%3A45Z&sks=b&skt=2025-06-21T15%3A09%3A45Z&ske=2025-06-27T16%3A09%3A45Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=3d249c53-07fa-4ba4-9b65-0bf8eb4ea46a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=OKgvGGAKYbzfu6Xay19kM4xfjMXTiMKhqaWwEBVpIXA%3D&az=oaivgprodscus';

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F5EFEB] p-4">
//       <div className="max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
//         {/* Form Column */}
//         <div className="p-8">
//           <h2 className="text-3xl font-bold text-[#2F4156] mb-6">
//             {isLogin ? 'Welcome back' : 'Create an account'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {!isLogin && (
//               <div>
//                 <label className="block text-[#2F4156] mb-1">Full Name</label>
//                 <div className="flex space-x-4">
//                   <input
//                     name="firstName"
//                     value={form.firstName}
//                     onChange={handleChange}
//                     placeholder="First"
//                     required
//                     className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                   />
//                   <input
//                     name="lastName"
//                     value={form.lastName}
//                     onChange={handleChange}
//                     placeholder="Last"
//                     required
//                     className="w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label className="block text-[#2F4156] mb-1">Email</label>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//               />
//             </div>

//             <div className="relative">
//               <label className="block text-[#2F4156] mb-1">Password</label>
//               <input
//                 name="password"
//                 type={showPwd ? 'text' : 'password'}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//                  autoComplete="current-password"
//                 className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//               />
//               <button type="button" onClick={toggleShow} className="absolute top-10 right-3 text-gray-500">
//                 {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}  
//               </button>
//             </div>

//             {!isLogin && (
//               <div className="relative">
//                 <label className="block text-[#2F4156] mb-1">Confirm Password</label>
//                 <input
//                   name="confirm"
//                   type={showPwd ? 'text' : 'password'}
//                   value={form.confirm}
//                   onChange={handleChange}
//                   placeholder="Confirm password"
//                   required
//                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
//                 />
//               </div>
//             )}

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <button
//               type="submit"
//               className="w-full flex justify-center items-center px-4 py-2 bg-[#2F4156] text-white font-semibold rounded-lg hover:bg-[#567C8D] transition"
//             >
//               {isLogin ? 'Log In' : 'Next Step'} <ArrowRight className="ml-2" />
//             </button>

//             <p className="text-center text-gray-600">
//               {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
//               <button type="button" onClick={() => { setIsLogin(l => !l); setError(''); }} className="text-[#567C8D] hover:underline">
//                 {isLogin ? 'Sign up' : 'Log in'}
//               </button>
//             </p>
//           </form>
//         </div>

//         {/* Image Column */}
//         <div className="hidden md:block">
//           <div
//             className="h-full bg-cover bg-center"
//             style={{ backgroundImage: `url('${sideImageUrl}')` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../utils/userSlice";
import { USER } from "../utils/constant";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleShow = () => setShowPwd(s => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password };
    try {
      const res = await axios.post(USER + endpoint, payload, { withCredentials: true });
      dispatch(setUser(res.data));
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  // decide which image to show
  const sideImageUrl = isLogin
    ? '/images/login-side.jpg'
    : '/images/signup-side.jpg';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5EFEB]">
      {/* Form Column */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#2F4156] mb-6 text-center">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[#2F4156] mb-2">Full Name</label>
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First"
                    required
                    className="flex-1 mb-4 sm:mb-0 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
                  />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last"
                    required
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[#2F4156] mb-2">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
              />
            </div>

            <div className="relative">
              <label className="block text-[#2F4156] mb-2">Password</label>
              <input
                name="password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
              />
              <button type="button" onClick={toggleShow} className="absolute top-10 right-3 text-gray-500">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <label className="block text-[#2F4156] mb-2">Confirm Password</label>
                <input
                  name="confirm"
                  type={showPwd ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#567C8D]"
                />
              </div>
            )}

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full flex justify-center items-center px-4 py-2 bg-[#2F4156] text-white font-semibold rounded-lg hover:bg-[#567C8D] transition"
            >
              {isLogin ? 'Log In' : 'Next Step'} <ArrowRight className="ml-2" />
            </button>

            <p className="text-center text-gray-600 mt-4">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={() => { setIsLogin(l => !l); setError(''); }} className="text-[#567C8D] hover:underline">
                {isLogin ? 'Sign up' : 'Log In'}
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Image Column */}
      <div className="hidden md:block md:w-1/2">
        <div
          className="h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${sideImageUrl}')` }}
        />
      </div>
    </div>
  );
}
