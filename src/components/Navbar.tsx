
export default function Navbar() {
    return (
        <nav className="bg-green-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">Nandur App</div>
                <div>
                    <a href="#" className="px-4 hover:underline">Home</a>
                    <a href="#" className="px-4 hover:underline">About</a>
                    <a href="#" className="px-4 hover:underline">Services</a>
                    <a href="#" className="px-4 hover:underline">Contact</a>
                </div>
            </div>
        </nav>
    )
}