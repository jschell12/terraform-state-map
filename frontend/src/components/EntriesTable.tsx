import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash,
  Calendar,
  User
} from "lucide-react";

const entries = [
  {
    id: "LOR-001",
    name: "Lorem Ipsum Dolor",
    client: "Sit Amet Corp",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Consectetur Adipiscing",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b169?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "CA"
    },
    dueDate: "2024-01-15",
    progress: 75,
    budget: "Elit Sed",
    tags: ["Do", "Eiusmod"]
  },
  {
    id: "TEM-002",
    name: "Tempor Incididunt",
    client: "Ut Labore Inc",
    status: "Planning",
    priority: "Medium",
    assignee: {
      name: "Et Dolore Magna",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "EDM"
    },
    dueDate: "2024-02-28",
    progress: 25,
    budget: "Aliqua Ut",
    tags: ["Enim", "Ad Minim"]
  },
  {
    id: "VEN-003",
    name: "Veniam Quis Nostrud",
    client: "Exercitation LLC",
    status: "Completed",
    priority: "High",
    assignee: {
      name: "Ullamco Laboris",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "UL"
    },
    dueDate: "2023-12-20",
    progress: 100,
    budget: "Nisi Ut",
    tags: ["Aliquip", "Ex Ea"]
  },
  {
    id: "COM-004",
    name: "Commodo Consequat",
    client: "Duis Aute Ltd",
    status: "In Progress",
    priority: "Medium",
    assignee: {
      name: "Irure Dolor",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "ID"
    },
    dueDate: "2024-01-30",
    progress: 60,
    budget: "In Reprehenderit",
    tags: ["Voluptate", "Velit"]
  },
  {
    id: "ESS-005",
    name: "Esse Cillum Dolore",
    client: "Eu Fugiat Co",
    status: "On Hold",
    priority: "Low",
    assignee: {
      name: "Nulla Pariatur",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "NP"
    },
    dueDate: "2024-03-15",
    progress: 15,
    budget: "Excepteur Sint",
    tags: ["Occaecat", "Cupidatat"]
  },
  {
    id: "NON-006",
    name: "Non Proident Sunt",
    client: "In Culpa Studio",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Qui Officia",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      initials: "QO"
    },
    dueDate: "2024-01-25",
    progress: 40,
    budget: "Deserunt Mollit",
    tags: ["Anim", "Id Est"]
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    "Completed": { variant: "default" as const, className: "bg-green-100 text-green-800 hover:bg-green-100" },
    "In Progress": { variant: "default" as const, className: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
    "Planning": { variant: "secondary" as const, className: "" },
    "On Hold": { variant: "default" as const, className: "bg-red-100 text-red-800 hover:bg-red-100" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { variant: "outline" as const, className: "" };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
};

const getPriorityBadge = (priority: string) => {
  const priorityConfig = {
    "High": { variant: "destructive" as const },
    "Medium": { variant: "default" as const, className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
    "Low": { variant: "secondary" as const }
  };
  
  const config = priorityConfig[priority as keyof typeof priorityConfig] || { variant: "outline" as const };
  
  return (
    <Badge variant={config.variant} className={config.className}>
      {priority}
    </Badge>
  );
};

export function EntriesTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Entries Table</CardTitle>
            <CardDescription>
              Consectetur adipiscing elit sed do eiusmod tempor incididunt
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Lorem ipsum dolor..."
              className="pl-8"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {entries.length} of {entries.length} entries
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lorem Ipsum</TableHead>
                <TableHead>Dolor Sit</TableHead>
                <TableHead>Amet</TableHead>
                <TableHead>Consectetur</TableHead>
                <TableHead>Adipiscing</TableHead>
                <TableHead>Elit Sed</TableHead>
                <TableHead>Do Eiusmod</TableHead>
                <TableHead>Tempor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">{entry.id}</div>
                      <div className="flex gap-1 mt-1">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span>{entry.client}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>{getPriorityBadge(entry.priority)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.assignee.avatar} alt={entry.assignee.name} />
                        <AvatarFallback>{entry.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{entry.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${entry.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[3rem]">{entry.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{entry.budget}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Lorem ipsum
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Dolor sit amet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Consectetur adipiscing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing 1-{entries.length} of {entries.length} results
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}