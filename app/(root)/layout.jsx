import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }) {

    const loggedIn = {firstName: 'Jean', lastName: 'Polo'}

    return (
        <main className="flex h-screen w-full font-inter">
            <Sidebar 
                user={loggedIn}
            />
            {children}
        </main>
    );
}