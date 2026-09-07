import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  KeyRound,
  UserCheck,
  UserX,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  LogIn,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user: currentUser,
    users,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    switchActiveUser,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Form states for Add User
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('mom');
  const [newStatus, setNewStatus] = useState<'active' | 'suspended'>('active');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Stats
  const totalUsers = users.length;
  const momCount = users.filter((u) => u.role === 'mom').length;
  const partnerCaregiverCount = users.filter((u) => u.role === 'partner' || u.role === 'caregiver').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const suspendedCount = users.filter((u) => u.status === 'suspended').length;

  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery));

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Please enter name and email', { type: 'error' });
      return;
    }

    createUser({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: newStatus,
      phone: newPhone.trim() || undefined,
      notes: newNotes.trim() || undefined,
      setupWizardCompleted: true,
      settings: {
        notificationsEnabled: true,
        units: 'metric',
        theme: 'soft-warm',
        soundEnabled: true,
      },
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewRole('mom');
    setNewStatus('active');
    setNewPhone('');
    setNewNotes('');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role,
      status: editingUser.status,
      phone: editingUser.phone,
      notes: editingUser.notes,
    });

    setEditingUser(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'mom':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'partner':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'caregiver':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div id="admin-management-screen" className="min-h-screen pb-16 max-w-md mx-auto bg-[#FAF7F5]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF7F5]/95 backdrop-blur-md px-4 pt-safe pb-3 border-b border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              id="admin-back-btn"
              onClick={() => navigate('/profile')}
              className="p-2 -ml-1.5 rounded-full text-stone-700 hover:bg-stone-200/60 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-purple-600" />
                <h1 className="text-base font-bold text-stone-900 font-display leading-tight">
                  Admin Console
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Manage Users
                </span>
              </div>
              <p className="text-[11px] text-stone-500">MamaNest System & User Directory</p>
            </div>
          </div>

          <button
            id="admin-add-user-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add User</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 bg-white border border-stone-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-stone-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total</span>
              <Users className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <div className="text-xl font-black text-stone-900 font-display">{totalUsers}</div>
            <div className="text-[10px] text-stone-500">Registered accounts</div>
          </div>

          <div className="p-3 bg-white border border-stone-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-rose-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Mothers</span>
              <span className="text-xs">🌸</span>
            </div>
            <div className="text-xl font-black text-rose-600 font-display">{momCount}</div>
            <div className="text-[10px] text-stone-500">Active families</div>
          </div>

          <div className="p-3 bg-white border border-stone-200/80 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Admins</span>
              <Shield className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-xl font-black text-purple-700 font-display">{adminCount}</div>
            <div className="text-[10px] text-stone-500">{suspendedCount ? `${suspendedCount} suspended` : 'All healthy'}</div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="admin-search-users-input"
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-200/80 rounded-2xl text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-purple-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Role filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {(['all', 'mom', 'partner', 'caregiver', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                  roleFilter === r
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>Showing {filteredUsers.length} of {totalUsers} users</span>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-purple-600 font-bold hover:underline"
              >
                Clear status filter
              </button>
            )}
          </div>

          {filteredUsers.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200/80 text-center space-y-2">
              <Users className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-700">No users found</p>
              <p className="text-[11px] text-stone-400">Try adjusting your search query or filter tags.</p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isCurrentUser = currentUser?.id === u.id;
              const isSuspended = u.status === 'suspended';

              return (
                <div
                  key={u.id}
                  className={`bg-white p-3.5 rounded-3xl border transition-all shadow-2xs ${
                    isCurrentUser ? 'border-purple-300 bg-purple-50/20' : 'border-stone-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={
                            u.avatarUrl ||
                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-2xl object-cover border border-stone-100"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                            isSuspended ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          title={isSuspended ? 'Suspended' : 'Active'}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-xs font-bold text-stone-900 truncate">
                            {u.name}
                          </h2>
                          {isCurrentUser && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-stone-900 text-white rounded-md">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate">{u.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadge(
                              u.role
                            )}`}
                          >
                            {u.role.toUpperCase()}
                          </span>

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isSuspended
                                ? 'bg-stone-100 text-stone-600'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Impersonate / Switch Button */}
                    {!isCurrentUser && (
                      <button
                        onClick={() => switchActiveUser(u)}
                        className="text-[10px] font-bold text-stone-600 hover:text-purple-700 bg-stone-50 hover:bg-purple-50 border border-stone-200 px-2 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        title="Quick Switch / Test as this user"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>Switch</span>
                      </button>
                    )}
                  </div>

                  {/* Metadata and Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="text-[10px] text-stone-400">
                      <span>Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Toggle status */}
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isSuspended
                            ? 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'
                            : 'text-stone-500 hover:bg-stone-100 border-stone-200'
                        }`}
                        title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                      >
                        {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                      </button>

                      {/* Reset password */}
                      <button
                        onClick={() => resetUserPassword(u.id)}
                        className="p-1.5 rounded-xl text-stone-500 hover:text-amber-600 hover:bg-amber-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Send Password Reset"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit user */}
                      <button
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 rounded-xl text-stone-500 hover:text-purple-600 hover:bg-purple-50 border border-stone-200 transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete user */}
                      {!isCurrentUser && (
                        <button
                          onClick={() => setConfirmDeleteId(u.id)}
                          className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Confirmation banner for deletion */}
                  {confirmDeleteId === u.id && (
                    <div className="mt-2.5 p-2.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-rose-800">
                        Delete user account permanently?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            deleteUser(u.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-1 bg-white border border-stone-200 text-stone-600 rounded-lg text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 font-display">Add New User</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Alba"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                  >
                    <option value="mom">Mom / Parent</option>
                    <option value="partner">Partner / Co-Parent</option>
                    <option value="caregiver">Caregiver / Nurse</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'active' | 'suspended')}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 font-display">Edit User</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                  >
                    <option value="mom">Mom / Parent</option>
                    <option value="partner">Partner / Co-Parent</option>
                    <option value="caregiver">Caregiver / Nurse</option>
                    <option value="admin">System Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, status: e.target.value as 'active' | 'suspended' })
                    }
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
