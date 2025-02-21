const Colors = {
    primary: "#1e88e5",
    primaryText: "#212121",
    secondaryText: "#757575",
    alternate: "#e0e3e7",
  
    primaryBackground: "#ffffff",
    secondaryBackground: "#f5f5f5",
  
    // ✅ Semantic Colors
    success: "#4CAF50", // Green for success messages
    warning: "#FFC107", // Yellow for warnings
    error: "#D32F2F",   // Red for errors
    info: "#2196F3",    // Blue for info messages
  
    // ✅ Button Variants
    buttonPrimary: "#1e88e5",
    buttonSecondary: "#757575",
    buttonDisabled: "#BDBDBD",
  
    // ✅ Border & Shadow
    border: "#E0E0E0",
    shadow: "rgba(0, 0, 0, 0.1)",
  } as const; // Ensures values are read-only
  
  export default Colors;
  