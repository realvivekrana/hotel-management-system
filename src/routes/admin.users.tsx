import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { usersApi } from "@/lib/api";
import type { Role, User } from "@/lib/types";
import { Plus, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" as Role });

  const refresh = () => usersApi.list().then(setUsers);
  useEffect(() => { refresh(); }, []);

  const create = async () => {
    if (!form.username || !form.email || !form.password) return toast.error("All fields required");
    try {
      await usersApi.create(form);
      toast.success("User created");
      setOpen(false);
      setForm({ username: "", email: "", password: "", role: "user" });
      refresh();
    } catch (e) { toast.error((e as Error).message); }
  };

  const remove = async (id: string) => {
    if (id === session?.user.id) return toast.error("Can't delete yourself");
    await usersApi.remove(id);
    toast.success("User removed");
    refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">Users</h1>
          <p className="mt-1 text-muted-foreground">Manage accounts and roles.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-1 h-4 w-4" /> New user</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create user</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <div><Label className="mb-1.5 block">Username</Label><Input value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} /></div>
              <div><Label className="mb-1.5 block">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
              <div><Label className="mb-1.5 block">Password</Label><Input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} /></div>
              <div>
                <Label className="mb-1.5 block">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({...form, role: v as Role})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-8 space-y-3">
        {users.map((u) => (
          <Card key={u.id} className="flex items-center justify-between border-border/60 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-medium">
                {u.username[0]?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {u.username}
                  {u.role === "admin" && <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary-foreground"><Shield className="h-3 w-3" /> admin</span>}
                </h3>
                <p className="text-xs text-muted-foreground">{u.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(u.id)} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}