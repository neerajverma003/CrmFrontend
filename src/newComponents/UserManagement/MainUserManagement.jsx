// import React, { useState } from "react";
// // import MyCards from "../UserManagement/MyCards.jsx";
// import UserCard from "./UserCard.jsx";
// import { SearchUser } from "./SearchUser.jsx";
// import { SearchRole } from "./SearchRoles.jsx";
// import AddUser from "./AddUser.jsx";
// import UserTable from "./UserTable.jsx";

// const MainUserManagement = () => {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [roleFilter, setRoleFilter] = useState("All Roles");

//     const cardData = [
//         { title: "Total Users", icon: "icon", value: 89, description: "+5 new this month" },
//         { title: "Active Users", icon: "icon", value: 84, description: "94.4% active rate" },
//         { title: "Admins", icon: "icon", value: 3, description: "System administrators" },
//         { title: "New This Week", icon: "icon", value: 7, description: "+2 from last week" },
//     ];

//     return (
//         <div className="max-h-[85vh] overflow-y-auto bg-[#f8f9fa] p-8">
//             {/* Header */}
//             <div className="mb-6">
//                 <h1 className="mb-2 text-2xl font-bold text-gray-900">User Management</h1>
//                 <p className="text-gray-600">
//                     Manage users, roles, and permissions across your organization
//                 </p>
//             </div>

//             {/* Stats Cards */}
//             {/* <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 {cardData.map((card, index) => (
//                     <MyCards key={index} {...card} />
//                 ))}
//             </div> */}

//             <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//                 <UserCard/>
//             </div>

//             {/* Search + Filter + Add */}
//             <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//                 <div className="flex flex-col gap-3 sm:flex-row">
//                     <SearchUser onSearch={setSearchTerm} />
//                     <SearchRole onRoleChange={setRoleFilter} />
//                 </div>
//                 <AddUser />
//             </div>

//             {/* User Table */}
//             <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//                 <UserTable searchTerm={searchTerm} roleFilter={roleFilter} />
//             </div>
//         </div>
//     );
// };

// export default MainUserManagement;

import React, { useState } from "react";
import UserCard from "./UserCard.jsx";
import { SearchUser } from "./SearchUser.jsx";
import { SearchRole } from "./SearchRoles.jsx";
import AddUser from "./AddUser.jsx";
import UserTable from "./UserTable.jsx";

const MainUserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");

    const cardData = [
        { title: "Total Users", icon: "icon", value: 89, description: "+5 new this month" },
        { title: "Active Users", icon: "icon", value: 84, description: "94.4% active rate" },
        { title: "Admins", icon: "icon", value: 3, description: "System administrators" },
        { title: "New This Week", icon: "icon", value: 7, description: "+2 from last week" },
    ];

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header */}
            <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">
                    Manage users, roles, and permissions across your organization
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <UserCard/>
            </div>

            {/* Search + Filter + Add */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SearchUser onSearch={setSearchTerm} />
                    <SearchRole onRoleChange={setRoleFilter} />
                </div>
                <AddUser />
            </div>

            {/* User Table */}
            <div className="w-full">
                <UserTable searchTerm={searchTerm} roleFilter={roleFilter} />
            </div>
        </div>
    );
};

export default MainUserManagement;