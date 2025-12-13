"use client";

import { useState } from "react";
import Image from "next/image";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useLoginMutation } from "@/feature/auth.api";
import Swal from "sweetalert2";
const UIT_BLUE = "#2563EB";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const canSubmit = username.trim() !== "" && password.trim() !== "";
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email:username, password }).unwrap();
      localStorage.setItem("access_token", res.access_token);
      if (res.access_token) {
        await Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          confirmButtonColor: "#2563EB",
        });

        window.location.href = "/homepage";
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: "Vui lòng kiểm tra lại thông tin",
          confirmButtonColor: "#2563EB",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Đăng nhập thất bại",
        text: "Vui lòng kiểm tra lại thông tin",
        confirmButtonColor: "#2563EB",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16">
              <Image
                src="/uit_icon.png"
                alt="UIT Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            <div className="flex-1">
              <div
                className="font-bold text-sm leading-tight"
                style={{ color: UIT_BLUE }}
              >
                TRƯỜNG ĐẠI HỌC
              </div>
              <div
                className="font-bold text-sm leading-tight"
                style={{ color: UIT_BLUE }}
              >
                CÔNG NGHỆ THÔNG TIN
              </div>
            </div>

            <div
              className="w-0.5 h-16"
              style={{ backgroundColor: UIT_BLUE }}
            ></div>

            <div className="flex-1">
              <div
                className=" font-bold text-xl leading-tight"
                style={{ color: UIT_BLUE }}
              >
                QUẢN LÝ
              </div>
              <div
                className=" font-bold text-xl leading-tight"
                style={{ color: UIT_BLUE }}
              >
                CƠ SỞ VẬT CHẤT
              </div>
            </div>
          </div>
        </div>

        <h2
          className="text-center font-semibold text-lg mb-6"
          style={{ color: UIT_BLUE }}
        >
          Dùng tài khoản nội bộ
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường Tài khoản */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tài khoản"
              autoComplete="username"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trường Mật khẩu */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              autoComplete="current-password"
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            className="w-full bg-[#2563EB] text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="inline-block">Đang đăng nhập...</span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
