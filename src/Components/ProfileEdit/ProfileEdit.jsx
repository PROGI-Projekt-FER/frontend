import React, { useState, useEffect } from "react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { Box, VStack, Heading, Text, Input, Button, createListCollection } from "@chakra-ui/react";
import { Toaster, toaster } from "../ui/toaster";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const [categories, setCategories] = useState(createListCollection({ items: [] })); // State for categories
  const [error, setError] = useState(null); // State for errors
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/info",
          { credentials: "include" }
        );
        const responseText = await response.text();
        const data = JSON.parse(responseText); // Parse the response to JSON
        setUserInfo(data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setError(error.message);
      }
    };

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

    fetchUserInfo();
    fetchCategories();
  }, []);

  const handleInputChange = (field, value) => {
    if (field === "preferredCategory") {
      // Find the selected category object by ID
      const selectedCategory = categories.items.find((category) => category.value === value);
      setUserInfo((prev) => ({
        ...prev,
        preferredCategory: selectedCategory, // Store the entire category object
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }  
  };

  const handleSave = async () => {
    console.log("Saving userInfo:", userInfo); // Print before saving
    try {
      const response = await fetch(
        "https://ticketswap-backend.onrender.com/api/users/info",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfo),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile changes");
      }

      toaster.create({
        title: "Profile updated successfully!",
        type: "success",
      });

      //navigate("/profile"); // Navigate back to the profile page
    } catch (error) {
      toaster.create({
        title: error.message || "An error occurred while saving the profile",
        type: "error",
      });
    }
  };

  if (!userInfo) {
    return <Text>Loading...</Text>; // Show a loading message while fetching data
  }

  return (
    <Box p="6" maxW="400px" mx="auto" bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack>
        <Avatar
          size="lg"
          name={`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
          src={userInfo?.profilePicUrl}
        />

        <Heading size="md">Edit Profile</Heading>

        <Input
          placeholder="First Name"
          value={userInfo.firstName || ""}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
        />
        <Input
          placeholder="Last Name"
          value={userInfo.lastName || ""}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
        />
        <Input
          placeholder="Username"
          value={userInfo.username || ""}
          onChange={(e) => handleInputChange("username", e.target.value)}
        />
        <Text color="gray.500">{userInfo.email || ""}</Text> {/* Email is static */}

        {
          <SelectRoot collection={categories} size="sm">
            <SelectLabel>Preferred Category</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Select preferred category" />
            </SelectTrigger>
            <SelectContent>
              {categories.items.map((category) => (
                <SelectItem
                  item={category}
                  key={category.value}
                  onClick={() => handleInputChange("preferredCategory", category.value)}
                >
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        }

        <Button colorScheme="blue" size="sm" onClick={handleSave}>
          Save
        </Button>
      </VStack>
    </Box>
  );
};

export default ProfileEdit;
