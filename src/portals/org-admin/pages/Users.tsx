
import { Card } from "@/shared/components/ui/card";
import { User, UserPlus, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

const Users = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Developer", status: "Active" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Participant", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Participant", status: "Active" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="glass-card card-hover p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <User className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-400">{user.role}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Users;
