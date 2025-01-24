import React, { useState, useEffect } from "react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import {
  Box,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  createListCollection,
  Center,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { Field } from "../ui/field";

import { Toaster, toaster } from "../ui/toaster";
import { Avatar } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [categories, setCategories] = useState(
    createListCollection({ items: [] })
  );
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setLoading(false);
    } else {
      toaster.create({
        title: "You must be logged in to create tickets",
        type: "error",
        duration: 6000,
      });
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          "https://ticketswap-backend.onrender.com/api/users/info",
          { credentials: "include" }
        );
        const responseText = await response.text();
        const data = JSON.parse(responseText);
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
    console.log(value);
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
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

      navigate("/profile");
    } catch (error) {
      toaster.create({
        title: error.message || "An error occurred while saving the profile",
        type: "error",
      });
    }
  };

  if (!userInfo || loading) {
    return (
      <>
        <Toaster />
        <Center h="88vh">
          <Flex direction={"column"} align={"center"} gap={"20px"}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </Flex>
        </Center>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <Center h="88vh">
        <Box
          p="6"
          width="400px"
          mx="auto"
          bg="gray.50"
          borderRadius="md"
          boxShadow="md"
        >
          <VStack>
            <Avatar
              size="lg"
              name={`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
              src={userInfo?.profilePicUrl}
            />
            <Heading size="md">Edit Profile</Heading>
            <Field label="Email">
              <Text color="gray.500">{userInfo.email || ""}</Text>
            </Field>
            <Field label="First Name">
              <Input
                placeholder="First Name"
                value={userInfo.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </Field>
            <Field label="Last Name">
              <Input
                placeholder="Last Name"
                value={userInfo.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </Field>
            <Field label="Username">
              <Input
                placeholder="Username"
                value={userInfo.username || ""}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </Field>
            {
              <SelectRoot
                collection={categories}
                size="sm"
                onValueChange={(item) =>
                  handleInputChange("preferredCategoryId", item.value[0])
                }
                defaultValue={
                  userInfo.preferredCategory?.id
                    ? [userInfo.preferredCategory.id.toString()]
                    : []
                }
              >
                <SelectLabel>Preferred Category</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Select preferred category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.items.map((category) => (
                    <SelectItem item={category} key={category.value}>
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
      </Center>
    </>
  );
};

export default ProfileEdit;
