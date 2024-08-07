import { useCallback, useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Spinner,
  Input,
  getKeyValue,
} from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import Sidebar from "../components/Sidebar";
import { FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

axios.defaults.baseURL = "https://univ-learn.onrender.com";
axios.defaults.withCredentials = true;

const statusColorMap = {
  active: "success",
  suspended: "danger",
  pending: "warning",
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [thumbnailSrc, setThumbnailSrc] = useState("");

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader(); // Create a new FileReader object
      reader.onload = () => {
        // Set the thumbnailSrc state with the data URL of the selected file
        setThumbnailSrc(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const [fullName, setFullName] = useState(selectedUser?.fullName);
  const [email, setEmail] = useState(selectedUser?.email);
  const [role, setRole] = useState(selectedUser?.role);

  const updateUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const userData = {};
    if (form.fullName.value) {
      userData.fullName = form.fullName.value;
    }
    if (form.email.value) {
      userData.email = form.email.value;
    }
    if (form.role.value) {
      userData.role = form.role.value;
    }
    if (form.status.value) {
      userData.status = form.status.value;
    }

    try {
      setIsUploading(true);
      const response = await axios.put(
        `/api/admins/users/${selectedUser?._id}`,
        userData
      );
      if (form.profilePicture.files[0]) {
        const response2 = await axios.put(
          `api/admins/users/profile-picture/${selectedUser?._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response2.data);
      }
      console.log(response.data);
      alert("User updated successfully!");
      setIsUploading(false);
      location.reload();
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Failed to update user!");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const response = await axios.delete(
        `/api/admins/users/${selectedUser?._id}`
      );
      console.log(response.data);
      alert("User deleted successfully!");
      setIsUploading(false);
      location.reload();
    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("Failed to delete user!");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      const fetchUsers = async () => {
        const response = await axios.get("/api/admins/users");
        setUsers(response.data);
      };
      fetchUsers();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredUsers = users.filter(
    (user) => user.role == "teacher" && user.status == "pending"
  );

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: `https://univ-learn.onrender.com/${user.profilePicture.slice(
                7
              )}`,
            }}
            description={user.email}
            name={user.fullName}
          >
            {user.email}
          </User>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedAction("details");
                  onOpen();
                }}
              >
                <FaRegEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit user">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedAction("edit");
                  onOpen();
                }}
              >
                <CiEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={() => {
                  setSelectedUser(user);
                  setSelectedAction("delete");
                  onOpen();
                }}
              >
                <MdDeleteOutline />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="flex justify-start">
      <Sidebar />
      <div className="grid place-items-center w-full">
        <div className="self-stretch mx-5 mt-8 w-full p-4">
          <Table radius="sm">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"No users to display."}>
              {filteredUsers &&
                filteredUsers?.map((user) => (
                  <TableRow key={user?.id}>
                    {columns.map((column) => (
                      <TableCell key={column.uid}>
                        {renderCell(user, column.uid)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="">
            {isLoading && (
              <div className="flex justify-center items-center w-full h-full bg-black/35">
                <Spinner size="lg" />
              </div>
            )}
          </div>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => {
                switch (selectedAction) {
                  case "details":
                    return (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          {`${selectedUser?.fullName}'s details`}
                        </ModalHeader>
                        <ModalBody>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Full Name</p>
                              <p className="text-sm">
                                {selectedUser?.fullName}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Email</p>
                              <p className="text-sm">{selectedUser?.email}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Role</p>
                              <p className="text-sm">{selectedUser?.role}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Status</p>
                              <p className="text-sm">{selectedUser?.status}</p>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    );
                  case "edit":
                    return (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          {`Editing ${selectedUser?.fullName}'s details`}
                        </ModalHeader>
                        <ModalBody>
                          <form
                            className="flex flex-col items-center gap-2"
                            onSubmit={updateUser}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <p className="font-medium">Profile Picture</p>
                              <img
                                src={
                                  thumbnailSrc ||
                                  "https://via.placeholder.com/150x150"
                                }
                                alt="profile picture"
                                className="rounded-full w-24 h-24"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                name="profilePicture"
                                onChange={handleThumbnailChange}
                              />
                            </div>
                            <div className="w-full">
                              <Input
                                type="text"
                                label="Full Name"
                                name="fullName"
                                value={fullName || selectedUser?.fullName}
                                onValueChange={setFullName}
                              />
                            </div>
                            <div className="w-full">
                              <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email || selectedUser?.email}
                                onValueChange={setEmail}
                              />
                            </div>
                            <div className="w-full">
                              <Input
                                type="text"
                                label="Role"
                                name="role"
                                value={role || selectedUser?.role}
                                onValueChange={setRole}
                              />
                            </div>
                            <div className="w-full">
                              <RadioGroup
                                orientation="horizontal"
                                name="status"
                                value={selectedUser?.status}
                                onChange={(e) =>
                                  setSelectedUser({
                                    ...selectedUser,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <Radio value="allowed">Allowed</Radio>
                                <Radio value="blocked">Blocked</Radio>
                                <Radio value="pending">Pending</Radio>
                              </RadioGroup>
                            </div>
                            <Button
                              type="submit"
                              onSubmit={() => {
                                updateUser();
                                onClose();
                              }}
                              color="primary"
                            >
                              Edit
                            </Button>
                          </form>
                        </ModalBody>
                        <ModalFooter>
                          <Button variant="light" onPress={onClose}>
                            Close
                          </Button>
                        </ModalFooter>
                      </>
                    );
                  case "delete":
                    return (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          {`Deleting ${selectedUser?.fullName}'s account`}
                        </ModalHeader>
                        <ModalBody>
                          <h2>Are you sure you want to delete this account?</h2>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="primary"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="danger"
                            onPress={onClose}
                            onClick={deleteUser}
                          >
                            Delete
                          </Button>
                        </ModalFooter>
                      </>
                    );
                }
              }}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default AdminUsersPage;
