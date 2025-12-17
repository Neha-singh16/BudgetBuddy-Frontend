// // src/components/Profile.jsx
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Pencil, X, Trash2 } from "lucide-react";
// import { setUser } from "../utils/userSlice";
// import { USER } from "../utils/constant";

// export default function Profile() {
//   const dispatch = useDispatch();
//   const user = useSelector((s) => s.user);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [edit, setEdit] = useState(false);

//   const defaultAvatar = "https://cdn.pfps.gg/pfps/2301-default-2.png";

//   // form fields
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNo: "",
//     address: "",
//     dob: "",
//   });

//   // avatar file + preview
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [previewURL, setPreviewURL] = useState("");
//   const [avatarVersion, setAvatarVersion] = useState(Date.now());
//   const [hasAvatar, setHasAvatar] = useState(false);

//   // build avatar URL (with cache‑busting)
//   // const avatarUrl = user
//   //   ? `${USER}/user/${user._id}/avatar?ver=${avatarVersion}`
//   //   : "https://cdn.pfps.gg/pfps/2301-default-2.png";

//   const avatarUrl = hasAvatar
//     ? `${USER}/user/${user._id}/avatar?ver=${avatarVersion}`
//     : defaultAvatar;


//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch(`${USER}/profile/view`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Failed to load profile");
//         const data = await res.json();
//         dispatch(setUser(data));
//         setForm({
//           firstName: data.firstName || "",
//           lastName: data.lastName || "",
//           email: data.email || "",
//           phoneNo: data.phoneNo || "",
//           address: data.address || "",
//           dob: data.dob?.split("T")[0] || "",
//         });
//         setHasAvatar(!!data.hasAvatar);
//       } catch (e) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [dispatch]);

//   const onChange = (e) => {
//     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
//     setError("");
//   };

//   const onAvatarChange = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setAvatarFile(f);
//     setPreviewURL(URL.createObjectURL(f));
//   };

//   const onDeleteAvatar = async () => {
//     if (!window.confirm("Delete your profile photo?")) return;
//     try {
//       const res = await fetch(`${USER}/user/avatar`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Failed to delete avatar");
//       setAvatarFile(null);
//       setPreviewURL("");
//       setAvatarVersion(Date.now());
//       setHasAvatar(false);
//     } catch (e) {
//       alert(e.message);
//     }
//   };

//   const onSave = async () => {
//     setLoading(true);
//     try {
//       if (avatarFile) {
//         const fd = new FormData();
//         fd.append("avatar", avatarFile);
//         const r = await fetch(`${USER}/user/avatar`, {
//           method: "PATCH",
//           credentials: "include",
//           body: fd,
//         });
//         if (!r.ok) throw new Error("Avatar upload failed");
//         setAvatarVersion(Date.now());
//         setAvatarFile(null);
//         setPreviewURL("");
//         setHasAvatar(true);
//       }

//       const r2 = await fetch(`${USER}/profile/update`, {
//         method: "PATCH",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       if (!r2.ok) throw new Error("Profile update failed");

//       const r3 = await fetch(`${USER}/profile/view`, {
//         credentials: "include",
//       });
//       const data = await r3.json();
//       dispatch(setUser(data));
//       setForm({
//         firstName: data.firstName || "",
//         lastName: data.lastName || "",
//         email: data.email || "",
//         phoneNo: data.phoneNo || "",
//         address: data.address || "",
//         dob: data.dob?.split("T")[0] || "",
//       });
//       setEdit(false);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading…</div>;
//   if (error) return <div className="p-8 text-red-600 text-center">{error}</div>;

//   return (
//     <div className="min-h-screen bg-[#F5EFEB] flex justify-center py-8 px-4">
//       <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 overflow-hidden">
//         {/* Avatar column */}
//         <div className="relative bg-[#faf9f6] flex items-center justify-center p-6">
//           <div className="w-full max-w-[300px] aspect-[3/4] rounded-xl overflow-hidden border-4 border-[#C8D9E6]">
//             <img
//               src={avatarFile ? previewURL : avatarUrl}
//               alt="Avatar"
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.currentTarget.onerror = null; // prevent loops
//                 e.currentTarget.src =
//                   "https://cdn.pfps.gg/pfps/2301-default-2.png";
//               }}
//             />
//           </div>
//           {edit && (
//             <div className="absolute bottom-6 flex space-x-2">
//               {/* Always allow changing photo */}
//               <label className="bg-white px-3 py-1 rounded shadow cursor-pointer text-[#2F4156] flex items-center">
//                 <Pencil size={16} className="mr-1" /> Change Photo
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={onAvatarChange}
//                   className="hidden"
//                 />
//               </label>
//               {/* Only show delete if a custom avatar exists and no new file selected */}
//               {hasAvatar && !avatarFile && (
//                 <button
//                   className="bg-white px-3 py-1 rounded shadow text-red-500 flex items-center"
//                   onClick={onDeleteAvatar}
//                 >
//                   <Trash2 size={16} className="mr-1" /> Delete Photo
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Details column */}
//         <div className="col-span-2 p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-[#2F4156]">
//               {user.firstName} {user.lastName}
//             </h2>
//             {edit ? (
//               <button onClick={() => setEdit(false)}>
//                 <X size={24} />
//               </button>
//             ) : (
//               <button onClick={() => setEdit(true)} className="text-[#567C8D]">
//                 <Pencil size={24} />
//               </button>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {[
//               { lbl: "First Name", nm: "firstName", disabled: false },
//               { lbl: "Last Name", nm: "lastName", disabled: false },
//               { lbl: "Email", nm: "email", disabled: true },
//               { lbl: "Phone No", nm: "phoneNo", disabled: false },
//               { lbl: "Address", nm: "address", disabled: false },
//               { lbl: "DOB", nm: "dob", disabled: false },
//             ].map(({ lbl, nm, disabled }) => (
//               <div key={nm}>
//                 <label className="block text-[#2F4156] mb-1">{lbl}</label>
//                 {edit && !disabled ? (
//                   <input
//                     name={nm}
//                     type={nm === "dob" ? "date" : "text"}
//                     value={form[nm]}
//                     onChange={onChange}
//                     className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#567C8D]"
//                   />
//                 ) : (
//                   <p className="px-3 py-2 bg-gray-100 rounded">
//                     {form[nm] || "—"}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {edit && (
//             <div className="flex justify-end space-x-3 pt-4 border-t">
//               <button
//                 onClick={onSave}
//                 className="px-5 py-2 bg-[#567C8D] text-white rounded hover:bg-[#2F4156] transition"
//               >
//                 Save Changes
//               </button>
//               <button
//                 onClick={() => setEdit(false)}
//                 className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// ─── src/components/Profile.jsx ───
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, X, Trash2, Camera, User } from "lucide-react";
import { setUser } from "../utils/userSlice";
import { USER }    from "../utils/constant";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const dispatch = useDispatch();
  const user     = useSelector(s => s.user);

  const [loading, setLoading]     = useState(true);
  const [error,   setError]       = useState("");
  const [edit,    setEdit]        = useState(false);

  const defaultAvatar = "https://cdn.pfps.gg/pfps/2301-default-2.png";

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phoneNo: "", address: "", dob: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [avatarVer, setAvatarVer]   = useState(Date.now());
  const [hasAvatar, setHasAvatar]   = useState(false);

  // Build the correct URL
  const avatarUrl = hasAvatar
    ? `${USER}/user/${user._id}/avatar?ver=${avatarVer}`
    : defaultAvatar;

  // Fetch profile on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${USER}/profile/view`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        dispatch(setUser(data));
        setForm({
          firstName: data.firstName || "",
          lastName:  data.lastName  || "",
          email:     data.email     || "",
          phoneNo:   data.phoneNo   || "",
          address:   data.address   || "",
          dob:       data.dob?.split("T")[0] || ""
        });
        setHasAvatar(Boolean(data.hasAvatar));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const onChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };
  const onAvatarChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    setPreviewURL(URL.createObjectURL(f));
  };
  const onDeleteAvatar = async () => {
    if (!window.confirm("Delete your profile photo?")) return;
    await fetch(`${USER}/user/avatar`, {
      method: "DELETE", credentials: "include"
    });
    setHasAvatar(false);
    setAvatarVer(Date.now());
  };

  const onSave = async () => {
    setLoading(true);
    try {
      // 1) Upload new avatar if any
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const r = await fetch(`${USER}/user/avatar`, {
          method: "PATCH",
          credentials: "include",
          body: fd
        });
        if (!r.ok) throw new Error("Avatar upload failed");

        // immediately re-fetch profile to get the real hasAvatar flag
        const vp = await fetch(`${USER}/profile/view`, { credentials: "include" });
        const vd = await vp.json();
        setHasAvatar(Boolean(vd.hasAvatar));
        setAvatarVer(Date.now());
        setAvatarFile(null);
        setPreviewURL("");
      }

      // 2) Update textual fields
      const r2 = await fetch(`${USER}/profile/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!r2.ok) throw new Error("Profile update failed");

      // 3) Final refetch and state sync
      const r3  = await fetch(`${USER}/profile/view`, { credentials: "include" });
      const data = await r3.json();
      dispatch(setUser(data));
      setForm({
        firstName: data.firstName || "",
        lastName:  data.lastName  || "",
        email:     data.email     || "",
        phoneNo:   data.phoneNo   || "",
        address:   data.address   || "",
        dob:       data.dob?.split("T")[0] || ""
      });
      setEdit(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 p-8 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
      />
    </div>
  );
  if (error)   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-md"
      >
        <p className="text-red-700 font-semibold">{error}</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-pink-50/20 py-4 md:py-8 px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 md:mb-8"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 sm:mb-2 flex items-center gap-2">
            <User className="text-purple-600 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
            My Profile
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Manage your personal information</p>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-purple-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Avatar Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 p-4 sm:p-6 md:p-8 flex items-center justify-center"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />

              <div className="relative z-10 w-full max-w-[200px] sm:max-w-[250px] md:max-w-[280px]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-sm"
                >
                  <img
                    src={avatarFile ? previewURL : avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                </motion.div>

                <AnimatePresence>
                  {edit && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-4 flex flex-col gap-2"
                    >
                      <motion.label
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg cursor-pointer text-purple-600 flex items-center justify-center gap-2 font-medium hover:bg-white transition-colors"
                      >
                        <Camera size={18} />
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onAvatarChange}
                          className="hidden"
                        />
                      </motion.label>
                      {hasAvatar && !avatarFile && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg text-red-500 flex items-center justify-center gap-2 font-medium hover:bg-white transition-colors"
                          onClick={onDeleteAvatar}
                        >
                          <Trash2 size={18} />
                          Delete Photo
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!edit && (
                  <div className="mt-4 text-center text-white">
                    <h3 className="text-2xl font-bold">{user.firstName} {user.lastName}</h3>
                    <p className="text-purple-200 mt-1">{user.email}</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 p-4 sm:p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Personal Information
                </h2>
                {edit ? (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEdit(false)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEdit(true)}
                    className="p-2 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Pencil size={20} className="md:w-6 md:h-6" />
                  </motion.button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {[
                  { lbl: "First Name", nm: "firstName", disabled: false },
                  { lbl: "Last Name",  nm: "lastName",  disabled: false },
                  { lbl: "Email",      nm: "email",     disabled: true  },
                  { lbl: "Phone No",   nm: "phoneNo",   disabled: false },
                  { lbl: "Address",    nm: "address",   disabled: false },
                  { lbl: "Date of Birth", nm: "dob",    disabled: false }
                ].map(({ lbl, nm, disabled }, idx) => (
                  <motion.div
                    key={nm}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="min-w-0"
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">{lbl}</label>
                    {edit && !disabled ? (
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        name={nm}
                        type={nm === "dob" ? "date" : "text"}
                        value={form[nm]}
                        onChange={onChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                      />
                    ) : (
                      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-800">{form[nm] || "—"}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {edit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEdit(false)}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-300 transition font-medium text-sm sm:text-base"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onSave}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition font-medium text-sm sm:text-base"
                    >
                      Save Changes
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

