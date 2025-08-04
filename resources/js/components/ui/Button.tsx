export default function Button({ children, ...props }) {
    return (
        <button
            {...props}
            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer ${props?.className}`}
        >
            {children}
        </button>
    );
}