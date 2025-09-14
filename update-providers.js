const fs = require("fs");
const path = require("path");

const providersDir =
  "b:\\UIT\\Đồ án 1\\DoAn1-cinema-management-fe\\src\\providers";
const filesToUpdate = [
  "DiscountsProvider.tsx",
  "EmployeesProvider.tsx",
  "OrdersProvider.tsx",
  "ProductsProvider.tsx",
  "RevenueProvider.tsx",
  "ReviewsProvider.tsx",
  "RoomsProvider.tsx",
  "SeatProvider.tsx",
  "SettingProvider.tsx",
  "ShowtimesProvider.tsx",
  "UserProvider.tsx",
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Add axios import if not present
    if (!content.includes("import axios")) {
      content = content.replace(
        /import React[^;]+;/,
        '$&\nimport axios from "axios";'
      );
    }

    // Replace fetch calls with axios
    // GET requests
    content = content.replace(
      /const response = await fetch\(`([^`]+)`,\s*{\s*headers:\s*{([^}]+)}\s*}\);/g,
      "const response = await axios.get(`$1`, {\n      headers: {$2}\n    });"
    );

    // POST requests
    content = content.replace(
      /const response = await fetch\(`([^`]+)`,\s*{\s*method:\s*"POST",\s*headers:\s*{([^}]+)},\s*body:\s*JSON\.stringify\(([^)]+)\)\s*}\);/g,
      "const response = await axios.post(`$1`, $3, {\n      headers: {$2}\n    });"
    );

    // PATCH requests
    content = content.replace(
      /const response = await fetch\(`([^`]+)`,\s*{\s*method:\s*"PATCH",\s*headers:\s*{([^}]+)},\s*body:\s*JSON\.stringify\(([^)]+)\)\s*}\);/g,
      "const response = await axios.patch(`$1`, $3, {\n      headers: {$2}\n    });"
    );

    // DELETE requests
    content = content.replace(
      /const response = await fetch\(`([^`]+)`,\s*{\s*method:\s*"DELETE",\s*headers:\s*{([^}]+)}\s*}\);/g,
      "const response = await axios.delete(`$1`, {\n      headers: {$2}\n    });"
    );

    // Replace response handling
    content = content.replace(
      /if \(!response\.ok\) {\s*const errorData = await response\.json\(\);\s*const errorMsg = ([^;]+);\s*throw new Error\(errorMsg\);\s*}\s*const data = await response\.json\(\);/g,
      "// Axios automatically throws on HTTP errors\n      const data = response.data;"
    );

    content = content.replace(
      /if \(!response\.ok\) {\s*const errorData = await response\.json\(\);\s*const errorMsg = ([^;]+);\s*throw new Error\(errorMsg\);\s*}/g,
      "// Axios automatically throws on HTTP errors"
    );

    // Replace error handling
    content = content.replace(/} catch \(error\) {/g, "} catch (error: any) {");

    content = content.replace(
      /const data = await response\.json\(\);/g,
      "const data = response.data;"
    );

    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
  }
}

filesToUpdate.forEach((filename) => {
  const filePath = path.join(providersDir, filename);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
