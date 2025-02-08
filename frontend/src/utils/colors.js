export const CATEGORY_COLORS = {
  Food: '#06b6d4',        // cyan-500
  Transport: '#818cf8',   // indigo-400
  Entertainment: '#34d399', // emerald-400
  Bills: '#f472b6',       // pink-400
  Other: '#94a3b8'        // slate-400
}

export const getCategoryColor = (category) => CATEGORY_COLORS[category] || CATEGORY_COLORS.Other 