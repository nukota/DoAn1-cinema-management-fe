import React from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { UserType } from "../../../../interfaces/types";

interface CustomerInformationProps {
  selectedTab: number;
  filterName: string;
  filterPhone: string;
  guestPhone: string;
  guestEmail: string;
  customers: UserType[];
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onFilterNameChange: (value: string) => void;
  onFilterPhoneChange: (value: string) => void;
  onGuestPhoneChange: (value: string) => void;
  onGuestEmailChange: (value: string) => void;
  onAccountSelect: (accountName: string) => void;
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  selectedTab,
  filterName,
  filterPhone,
  guestPhone,
  guestEmail,
  customers,
  onTabChange,
  onFilterNameChange,
  onFilterPhoneChange,
  onGuestPhoneChange,
  onGuestEmailChange,
  onAccountSelect,
}) => {
  const filteredAccounts = customers.filter(
    (account: UserType) =>
      account.full_name.toLowerCase().includes(filterName.toLowerCase()) &&
      account.phone.includes(filterPhone)
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs for Existed Account and Guest */}
      <Tabs
        value={selectedTab}
        onChange={onTabChange}
        aria-label="Customer Tabs"
        sx={{ mb: 2 }}
      >
        <Tab label="Existed Account" />
        <Tab label="Guest" />
      </Tabs>

      {/* Existed Account Tab */}
      {selectedTab === 0 && (
        <Box>
          {/* Filter Fields */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={filterName}
              onChange={(e) => onFilterNameChange(e.target.value)}
              fullWidth
            />
            <TextField
              label="Phone"
              variant="outlined"
              value={filterPhone}
              onChange={(e) => onFilterPhoneChange(e.target.value)}
              fullWidth
            />
          </Box>

          {/* Customer List */}
          <List sx={{ maxHeight: "380px", overflowY: "auto" }}>
            {filteredAccounts.map((account: UserType) => (
              <ListItem key={account._id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  sx={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                  onClick={() =>
                    onAccountSelect(`${account.full_name} (${account.phone})`)
                  }
                >
                  <ListItemText
                    primary={`${account.full_name} (${account.phone})`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {/* Guest Tab */}
      {selectedTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Phone"
              variant="outlined"
              value={guestPhone}
              onChange={(e) => onGuestPhoneChange(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              value={guestEmail}
              onChange={(e) => onGuestEmailChange(e.target.value)}
              fullWidth
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomerInformation;
