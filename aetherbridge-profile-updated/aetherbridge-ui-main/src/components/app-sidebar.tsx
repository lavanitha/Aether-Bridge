import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Award,
  Wallet,
  FileText,
  Shield,
  UserCheck,
  CheckCircle,
  PlusSquare
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Mentorship", url: "/mentorship", icon: Users },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Skill Assessment", url: "/assessment", icon: Award },
]

const blockchainItems = [
  { title: "Connect Wallet", url: "/wallet", icon: Wallet },
  { title: "View Credentials", url: "/credentials", icon: Shield },
  { title: "Credential Viewer", url: "/credential-viewer", icon: Shield },
];

const studentItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Application", url: "/application", icon: FileText },
  { title: "Equivalency Finder", url: "/equivalency-finder", icon: FileText },
  { title: "Credential Viewer", url: "/credential-viewer", icon: Shield },
  { title: "Mint NFT", url: "/mint-nft", icon: PlusSquare },
];

const adminItems = [
  { title: "App Review", url: "/app-review", icon: UserCheck },
  { title: "Verify Credentials", url: "/verify-credentials", icon: CheckCircle },
];

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-card" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200"

  const collapsed = state === "collapsed"

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r transition-all duration-300 bg-[#1a002a] border-gray-800`}
      collapsible="icon"
    >
      <SidebarContent className="bg-[#1a002a] text-white">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-white">AetherBridge</h1>
                <p className="text-xs text-gray-400">Academic Mobility</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            {mainItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <NavLink to={item.url} className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-4 py-2 rounded-md`}>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Student Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">Student</SidebarGroupLabel>
          <SidebarGroupContent>
            {studentItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <NavLink to={item.url} className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-4 py-2 rounded-md`}>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Blockchain Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">Blockchain</SidebarGroupLabel>
          <SidebarGroupContent>
            {blockchainItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <NavLink to={item.url} className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-4 py-2 rounded-md`}>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            {adminItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <NavLink to={item.url} className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-4 py-2 rounded-md`}>
                  <item.icon className="h-5 w-5" />
                  {!collapsed && item.title}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-gray-800">
          <SidebarTrigger>
            <SidebarMenuButton className="w-full">
              <Shield className="h-5 w-5" />
              {!collapsed && "Toggle Sidebar"}
            </SidebarMenuButton>
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}