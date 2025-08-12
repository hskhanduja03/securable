export function getRandomIconBg() {
  const colors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-yellow-100 text-yellow-600",
    "bg-purple-100 text-purple-600",
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
    "bg-orange-100 text-orange-600",
    "bg-cyan-100 text-cyan-600",
    "bg-lime-100 text-lime-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-fuchsia-100 text-fuchsia-600",
    "bg-violet-100 text-violet-600",
    "bg-sky-100 text-sky-600",
    "bg-amber-100 text-amber-600",
  ];

  if (colors.length === 0) {
    return "bg-gray-100 text-gray-600";
  }

  const index = Math.floor(Math.random() * colors.length);
  return colors[index] || "bg-gray-100 text-gray-600";
}

export function getRandomGradient() {
const gradients = [
  "from-orange-600 to-red-700",
  "from-gray-700 to-gray-900",
  "from-pink-700 to-rose-800",
  "from-green-700 to-emerald-800",
  "from-blue-700 to-indigo-900",
  "from-purple-700 to-violet-900",
  "from-yellow-600 to-amber-700",
  "from-teal-700 to-cyan-800",
  "from-sky-700 to-blue-800",

  // Extra darker rich gradients:
  "from-red-800 to-yellow-900",
  "from-indigo-800 to-purple-900",
  "from-emerald-800 to-green-900",
  "from-rose-800 to-pink-900",
  "from-cyan-700 to-teal-900",
  "from-violet-800 to-purple-900",
  "from-amber-700 to-yellow-800",
  "from-gray-800 to-gray-900",
  "from-blue-800 to-sky-900",
];


  if (!gradients || gradients.length === 0) {
    return "from-gray-500 to-gray-600"; // fallback if gradients is empty or undefined
  }

  const randomIndex = Math.floor(Math.random() * gradients.length);
  const gradient = gradients[randomIndex];

  return gradient || "from-gray-500 to-gray-600"; // fallback if somehow undefined
}
