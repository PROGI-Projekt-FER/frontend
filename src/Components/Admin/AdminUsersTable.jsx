import React from "react";
import { Box, Button, Flex, Table, Text, Stack } from "@chakra-ui/react";
import { Avatar } from "../ui/avatar";
import { Radio, RadioGroup } from "../ui/radio";

const AdminUsersTable = ({
  users,
  handleDeactivate,
  handleGenerateIzv,
  handleChangeRole,
}) => {
  return (
    <Box>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Avatar</Table.ColumnHeader>
            <Table.ColumnHeader>First Name</Table.ColumnHeader>
            <Table.ColumnHeader>Last Name</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Preferred Category</Table.ColumnHeader>
            <Table.ColumnHeader>Actions</Table.ColumnHeader>
            <Table.ColumnHeader>User role</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map((user, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Avatar
                  size="md"
                  name={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  src={user?.profilePicUrl}
                />
              </Table.Cell>
              <Table.Cell>{user.firstName}</Table.Cell>
              <Table.Cell>{user.lastName}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>
                {user.preferredCategory ? (
                  <Box>
                    <Text fontWeight="bold">{user.preferredCategory.name}</Text>
                    <Text color="gray.500" fontSize="sm">
                      {user.preferredCategory.parentCategory}
                    </Text>
                  </Box>
                ) : (
                  <Text color="gray.500">-</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Flex gap={"2px"} alignItems="center">
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeactivate(user.id)}
                  >
                    Deactivate
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleGenerateIzv(user.id)}
                  >
                    Generate report
                  </Button>
                </Flex>
              </Table.Cell>
              <Table.Cell>
                <Flex gap={"2px"} alignItems="center">
                  <RadioGroup
                    onChange={(value) => handleChangeRole(user.id, value)}
                    value={user.role}
                  >
                    <Stack direction="row">
                      <Radio value="regular">Regular User</Radio>
                      <Radio value="admin">Admin</Radio>
                    </Stack>
                  </RadioGroup>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default AdminUsersTable;
