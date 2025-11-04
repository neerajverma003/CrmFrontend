import React from "react";
import changePassword from "../../assets/changePassword.jpg"

const ChangePassword = () => {
    return (
      <div class="grid md:grid-cols-2 grid-cols-1">
         <div class="bg-[linear-gradient(180deg,#E9F0FB_0%,#F6FBFF_100%)] flex flex-col justify-center items-center p-6 h-screen">
              <div class="flex flex-col items-center justify-center gap-4 text-center">
                <img src={changePassword} class="rounded-md w-72 h-40 md:w-96 md:h-52 object-cover"/>
                <h3 class="text-[#0F2133] text-lg md:text-xl text-center">Change Your Password</h3>
                <span class='text-gray-500 text-sm md:text-base px-2 md:px-0'>Manage your customer relationships with our powerful, intuitive platform</span>
              </div>
             
            </div>
        <div class="flex flex-col items-center justify-center px-4 py-4">
            <div class="w-full max-w-lg gap-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
                <div class="flex items-center justify-center text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.75"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M12 2l6 3v5c0 5-3.8 9.7-6 10-2.2-.3-6-5-6-10V5l6-3z" />
                        <path d="M12 6v6" />
                    </svg>
                </div>

                <div class="flex flex-col items-center justify-center gap-2">
                    <p class="flex gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.75"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                            <rect
                                x="3"
                                y="11"
                                width="18"
                                height="10"
                                rx="2"
                                ry="2"
                            />
                            <circle
                                cx="12"
                                cy="16"
                                r="1.2"
                            />
                        </svg>
                        Change Password
                    </p>
                    <p>Update your password to keep your account secure</p>
                </div>

                <div class="flex flex-col gap-3 my-10">
                    <div class="flex flex-col">
                        <label class="font-bold">Current Password</label>

                        <div class="relative w-full">
                            <input
                                type="password"
                                placeholder="Enter your Current Password"
                                class="w-full rounded-lg border bg-[#FBFDFF] px-2 py-3 pr-10 outline-none"
                                id="password"
                            />
                            {/* <!-- Eye Icon --> */}
                            <svg
                                id="eyeOpen"
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 
               12 5c4.478 0 8.268 2.943 
               9.542 7-1.274 4.057-5.064 
               7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold">New Password</label>

                        <div class="relative w-full">
                            <input
                                type="password"
                                placeholder="Enter your New Password"
                                class="w-full rounded-lg border bg-[#FBFDFF] px-2 py-3 pr-10 outline-none"
                                id="password"
                            />
                            {/* <!-- Eye Icon --> */}
                            <svg
                                id="eyeOpen"
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 
               12 5c4.478 0 8.268 2.943 
               9.542 7-1.274 4.057-5.064 
               7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label class="font-bold">Confirm New Password</label>

                        <div class="relative w-full">
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                class="w-full rounded-lg border bg-[#FBFDFF] px-2 py-3 pr-10 outline-none"
                                id="password"
                            />
                            {/* <!-- Eye Icon --> */}
                            <svg
                                id="eyeOpen"
                                xmlns="http://www.w3.org/2000/svg"
                                class="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 
               12 5c4.478 0 8.268 2.943 
               9.542 7-1.274 4.057-5.064 
               7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                    </div>
                    <button class="w-full bg-black py-2 text-white">Update Password</button>
                </div>
                <div class="text-center">Make sure your new password is strong and contains at least 8 characters.</div>
            </div>
        </div>
        </div>
    );
};

export default ChangePassword;
