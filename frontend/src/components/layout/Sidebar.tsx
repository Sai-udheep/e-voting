import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Vote, 
  BarChart3, 
  FileText, 
  UserPlus, 
  UserMinus, 
  CheckCircle,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const voterLinks = [
    { to: '/voter/cast-vote', label: 'Cast Vote', icon: Vote },
    { to: '/voter/results', label: 'View Results', icon: BarChart3 },
  ];

  const candidateLinks = [
    { to: '/candidate/cast-vote', label: 'Cast Vote', icon: Vote },
    { to: '/candidate/nominate', label: 'Submit Nomination', icon: FileText },
    { to: '/candidate/results', label: 'View Results', icon: BarChart3 },
  ];

  const adminLinks = [
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/elections', label: 'Manage Elections', icon: BarChart3 },
    { to: '/admin/candidates', label: 'Manage Candidates', icon: UserPlus },
    { to: '/admin/validate', label: 'Validate Voters', icon: CheckCircle },
    { to: '/admin/results', label: 'Final Results', icon: BarChart3 },
  ];

  const links = user.role === 'voter' 
    ? voterLinks 
    : user.role === 'candidate' 
    ? candidateLinks 
    : adminLinks;

  return (
    <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground"
            )}
            activeClassName="bg-primary text-primary-foreground"
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
