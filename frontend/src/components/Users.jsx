/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
            .then(response => {
                if (response.data && response.data.users) {
                    setUsers(response.data.users);
                } else {
                    setUsers([]);
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
                setUsers([]);
            });
    }, [filter]);

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e) => setFilter(e.target.value)} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200" />
        </div>
        <div>
            {users.map(user => <User key={user.user_id} user={user} />)}
        </div>
    </>;
};

function User({ user }) {
    const navigate = useNavigate();

    return <div className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstname[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-full">
                <div>
                    {user.firstname} {user.lastname}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-full">
            {/* //if transfer is successful, it will show a message "Transfer successful" on the screen and move to the dashboard page */}
            <Button onClick={() => {
                navigate(`/send?id=${user.user_id}&name=${user.firstname}`);
            }} label={"Send Money"} 
            
            
            />





        </div>
    </div>;
}
