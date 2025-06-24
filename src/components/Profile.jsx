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
import { Pencil, X, Trash2 } from "lucide-react";
import { setUser } from "../utils/userSlice";
import { USER }    from "../utils/constant";

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

  if (loading) return <div className="p-8 text-center">Loading…</div>;
  if (error)   return <div className="p-8 text-red-600 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex justify-center py-8 px-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* Avatar column */}
        <div className="relative bg-[#faf9f6] flex items-center justify-center p-6">
          <div className="w-full max-w-[300px] aspect-[3/4] rounded-xl overflow-hidden border-4 border-[#C8D9E6]">
            <img
              src={avatarFile ? previewURL : avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
            />
          </div>
          {edit && (
            <div className="absolute bottom-6 flex space-x-2">
              <label className="bg-white px-3 py-1 rounded shadow cursor-pointer text-[#2F4156] flex items-center">
                <Pencil size={16} className="mr-1" /> Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="hidden"
                />
              </label>
              {hasAvatar && !avatarFile && (
                <button
                  className="bg-white px-3 py-1 rounded shadow text-red-500 flex items-center"
                  onClick={onDeleteAvatar}
                >
                  <Trash2 size={16} className="mr-1" /> Delete Photo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Details column */}
        <div className="col-span-2 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-[#2F4156]">
              {user.firstName} {user.lastName}
            </h2>
            {edit ? (
              <button onClick={() => setEdit(false)}>
                <X size={24} />
              </button>
            ) : (
              <button onClick={() => setEdit(true)} className="text-[#567C8D]">
                <Pencil size={24} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { lbl: "First Name", nm: "firstName", disabled: false },
              { lbl: "Last Name",  nm: "lastName",  disabled: false },
              { lbl: "Email",      nm: "email",     disabled: true  },
              { lbl: "Phone No",   nm: "phoneNo",   disabled: false },
              { lbl: "Address",    nm: "address",   disabled: false },
              { lbl: "DOB",        nm: "dob",       disabled: false }
            ].map(({ lbl, nm, disabled }) => (
              <div key={nm}>
                <label className="block text-[#2F4156] mb-1">{lbl}</label>
                {edit && !disabled ? (
                  <input
                    name={nm}
                    type={nm === "dob" ? "date" : "text"}
                    value={form[nm]}
                    onChange={onChange}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#567C8D]"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-100 rounded">
                    {form[nm] || "—"}
                  </p>
                )}
              </div>
            ))}
          </div>

          {edit && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={onSave}
                className="px-5 py-2 bg-[#567C8D] text-white rounded hover:bg-[#2F4156] transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEdit(false)}
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

