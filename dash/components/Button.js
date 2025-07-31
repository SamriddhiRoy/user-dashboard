export function Button({ children, variant = "solid", size = "md", className = "", ...props }) {
  const base = "rounded-xl px-4 py-2 text-sm font-medium flex items-center justify-center gap-1";
  const variants = {
    solid: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-500 hover:text-black",
  };
  const sizes = {
    md: "text-sm",
    icon: "p-2",
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
