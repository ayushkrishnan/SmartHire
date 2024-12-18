import { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

type User = {
    id: number,
    email: string,
    name: string,
    type: string,
    contact: string
}

// This is a mock function to simulate fetching users from an API
async function getUsers(): Promise<User[]> {
  // In a real application, this would be an API call
  return [
    { id: 1, email: "john@example.com", name: "John Doe", type: "applicant", contact: "123-456-7890" },
    { id: 2, email: "jane@example.com", name: "Jane Smith", type: "employer", contact: "098-765-4321" },
    { id: 3, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 4, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 5, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 6, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 7, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 8, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 9, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 10, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    { id: 11, email: "admin@example.com", name: "Admin User", type: "admin", contact: "111-222-3333" },
    // Add more mock users as needed
  ];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-5">User Management</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell>{user.contact || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink 
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

