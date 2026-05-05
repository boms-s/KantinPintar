"use client";

import { useEffect, useState } from "react";

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("currentUser") || "null");
    setUser(data);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Profil</h1>

      {user ? (
        <>
          <p>Nama: {user.fullName}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>Belum login</p>
      )}
    </div>
  );
}