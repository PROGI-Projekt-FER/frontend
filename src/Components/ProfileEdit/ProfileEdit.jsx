import React, { useState, useEffect } from "react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText} from "../ui/select";
import { Box, VStack, Heading, Text, Input, Button, createListCollection } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import { Avatar } from "../ui/avatar";

const ProfileEdit = () => {
  // Set initial profile values
  const [firstName, setFirstName] = useState("Sage");
  const [lastName, setLastName] = useState("Adebayo");
  const [username, setUsername] = useState("sage_adebayo");
  const [offerType, setOfferType] = useState("");
  const [swapCategoryId, setSwapCategoryId] = useState("");
  const [categories, setCategories] = useState(
      createListCollection({ items: [] })
    );

  useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await fetch(
            "https://ticketswap-backend.onrender.com/api/categories"
          );
          const data = await response.json();
          const categoryList = data.map((category) => ({
            label: category.name,
            value: category.id.toString(),
          }));
          setCategories(createListCollection({ items: categoryList }));
        } catch (error) {
          toaster.create({
            title: "Failed to fetch categories",
            type: "error",
          });
        }
      };
      fetchCategories();
    }, []);

  // Handle submit logic
  const handleSave = () => {
    // Here you could add logic to save the edited profile
    console.log("Profile saved:", { firstName, lastName, username });
  };

  return (
    <Box p="6" maxW="400px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack>
        <Avatar size="lg" name="Sage" src="https://bit.ly/sage-adebayo" />

        <Heading size="md">Edit Profile</Heading>

        <Input
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <Text color="gray.500">sage_adebayo@example.com</Text> {/* Email is static */}

        {
        <SelectRoot collection={categories} size="sm">
            <SelectLabel>Swap Category</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select category for swap" />
            </SelectTrigger>
            <SelectContent>
              {categories.items.map((category) => (
                <SelectItem
                  item={category}
                  key={category.value}
                  onClick={() => setSwapCategoryId(category.value)}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
        </SelectRoot>
        }

        <Button colorScheme="blue" size="sm" onClick={handleSave}>Save</Button>
      </VStack>
    </Box>
  );
};

export default ProfileEdit;