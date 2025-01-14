import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Table,
  Text,
  Input,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "../ui/dialog";
import { MdEdit, MdDelete } from "react-icons/md";

const AdminCategoriesTable = ({
  categories,
  handleEditCategory,
  handleDeleteCategory,
  handleAddCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedColor, setEditedColor] = useState("");
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#eb5e41");

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setEditedName(category.name);
    setEditedColor(category.colorHexCode);
  };

  const handleSaveChanges = () => {
    if (selectedCategory) {
      handleEditCategory({
        ...selectedCategory,
        name: editedName,
        colorHexCode: editedColor,
      });
    }
  };

  const handleAddNewCategory = () => {
    if (newName && newColor) {
      handleAddCategory({
        name: newName,
        colorHexCode: newColor,
      });
      setNewName("");
      setNewColor("#eb5e41");
    }
  };

  return (
    <Box>
      <Flex justifyContent="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Categories
        </Text>
        <DialogRoot>
          <DialogTrigger asChild>
            <Button colorScheme="green" size="sm">
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text mb={2}>Category Name</Text>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                mb={4}
                placeholder="Enter category name"
              />
              <Text mb={2}>Color</Text>
              <Input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                mb={4}
              />
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" onClick={() => setNewName("")}>
                  Cancel
                </Button>
              </DialogActionTrigger>
              <DialogActionTrigger asChild>
                <Button colorScheme="green" onClick={handleAddNewCategory}>
                  Add
                </Button>
              </DialogActionTrigger>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      </Flex>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Color</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((category, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Badge
                  bgColor={category.colorHexCode}
                  color="white"
                  px="2"
                  py="1"
                  borderRadius="md"
                  fontSize="sm"
                >
                  {category.name}{" "}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Box
                  width="20px"
                  height="20px"
                  borderRadius="full"
                  bg={category.colorHexCode}
                />
              </Table.Cell>
              <Table.Cell>
                <Flex gap={"2px"}>
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <IconButton
                        aria-label="Edit Ticket"
                        size="sm"
                        colorScheme="blue"
                        onClick={() => openEditDialog(category)}
                      >
                        <MdEdit />
                      </IconButton>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        <Text mb={2}>Category Name</Text>
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          mb={4}
                        />
                        <Text mb={2}>Color</Text>
                        <Input
                          type="color"
                          value={editedColor}
                          onChange={(e) => setEditedColor(e.target.value)}
                          mb={4}
                        />
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedCategory(null)}
                          >
                            Cancel
                          </Button>
                        </DialogActionTrigger>
                        <DialogActionTrigger asChild>
                          <Button
                            colorScheme="blue"
                            onClick={handleSaveChanges}
                          >
                            Save
                          </Button>
                        </DialogActionTrigger>
                      </DialogFooter>
                      <DialogCloseTrigger />
                    </DialogContent>
                  </DialogRoot>
                  <IconButton
                    aria-label="Delete Ticket"
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <MdDelete />
                  </IconButton>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default AdminCategoriesTable;
