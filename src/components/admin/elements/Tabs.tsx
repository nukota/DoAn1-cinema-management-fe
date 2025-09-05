import React, { ReactNode, useState, useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

interface TabItem {
  label: string;
  value: string;
}

interface CustomTabsProps {
  title: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  tabs: TabItem[];
  data: any[]; // Raw data array
  gridCols?: string;
  gap?: string;
  className?: string;
  onAddNew?: () => void;
  addButtonText?: string;
  dateColumns?: string[]; // Array of column names that can be filtered with dates
  searchColumns?: string[]; // Array of column names to search in
  children: (filteredData: any[]) => ReactNode; // Render prop for filtered data
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  title,
  activeTab,
  onTabChange,
  tabs,
  data,
  gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
  gap = "gap-y-8",
  className = "",
  onAddNew,
  addButtonText = "Add New",
  dateColumns = [],
  searchColumns = [],
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // Filtering logic moved inside CustomTabs
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Tab filtering
      const matchesTab =
        activeTab === "All" ||
        item.status === activeTab ||
        (activeTab === "Food and Drinks" &&
          (item.category === "Food" || item.category === "Drink")) ||
        (activeTab === "Others" &&
          item.category !== "Food" &&
          item.category !== "Drink" &&
          item.category !== "Souvenirs") ||
        item.category === activeTab;

      // Search filtering
      let matchesSearch = true;
      if (searchTerm && searchColumns.length > 0) {
        const searchTermLower = searchTerm.toLowerCase();
        matchesSearch = searchColumns.some((column) => {
          const value = item[column];
          if (Array.isArray(value)) {
            return value.some(
              (v) => v && v.toString().toLowerCase().includes(searchTermLower)
            );
          }
          return (
            value && value.toString().toLowerCase().includes(searchTermLower)
          );
        });
      }

      // Date filtering
      let matchesDate = true;
      if (selectedDate && dateColumns.length > 0) {
        matchesDate = dateColumns.some((column) => {
          const itemDate = item[column];
          if (!itemDate) return false;

          // Handle different date formats
          if (column.includes("ordered_at") || column.includes("created_at")) {
            return itemDate.startsWith(selectedDate);
          } else {
            return new Date(itemDate) <= new Date(selectedDate);
          }
        });
      }

      return matchesTab && matchesSearch && matchesDate;
    });
  }, [data, activeTab, searchTerm, selectedDate, searchColumns, dateColumns]);

  const showActionBar =
    onAddNew || searchColumns.length > 0 || dateColumns.length > 0;

  return (
    <div
      className={`flex flex-col w-full h-full max-w-full min-h-screen ${className}`}
    >
      {/* Title */}
      <div className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-medium text-dark-gray mb-2">
        {title}
      </div>

      {/* Action Bar */}
      {showActionBar && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            rowGap: 1,
            alignItems: { xs: "flex-start", md: "center" },
            mt: 2,
            mb: 1,
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "flex-start", md: "space-between" },
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Date Filter */}
            {dateColumns.length > 0 && (
              <TextField
                type="date"
                size="small"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={
                  dateColumns.includes("ordered_at")
                    ? { shrink: true }
                    : undefined
                }
                sx={{
                  width: 240,
                  backgroundColor: "white",
                  borderRadius: "4px",
                }}
              />
            )}

            {/* Search Field */}
            {searchColumns.length > 0 && (
              <TextField
                placeholder="Search"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: 240,
                  backgroundColor: "white",
                  borderRadius: "4px",
                }}
              />
            )}
          </Box>

          {/* Add Button */}
          {onAddNew && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disableElevation
              onClick={onAddNew}
            >
              {addButtonText}
            </Button>
          )}
        </Box>
      )}

      {/* Tabs and Content */}
      <div className="content relative min-w-[360px] sm:min-w-[680px] w-full flex-1 bg-white border-[1px] border-light-gray rounded-md flex flex-col">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              "& .MuiTab-root": {
                fontWeight: 600,
                minWidth: 120,
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </Box>

        {/* Content Area */}
        <div
          className={`list flex-1 grid ${gridCols} ${gap} py-6 pl-4 overflow-y-auto max-h-[400px] sm:max-h-[450px] md:max-h-[500px] lg:max-h-[550px] xl:max-h-[600px] list-scrollbar`}
        >
          {children(filteredData)}
        </div>
      </div>
    </div>
  );
};

export default CustomTabs;
