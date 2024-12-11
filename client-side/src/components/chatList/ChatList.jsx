import { Link, useNavigate } from "react-router-dom";
import "./chatList.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ChatList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Add navigation hook

  // Fetch chats
  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  // Delete chat mutation
  const deleteChat = useMutation({
    mutationFn: (chatId) =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Error deleting chat!");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["userChats"]);
      navigate("/dashboard"); // Redirect after successful deletion
    },
  });

  // Handle delete
  const handleDelete = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      deleteChat.mutate(chatId);
    }
  };

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new Chat</Link>
      <Link to="/">Follow Ups</Link>
      <Link to="/">Networking Goal</Link>
      <Link to="/">Events</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? "Loading..."
          : error
          ? "Something went wrong!"
          : data?.map((chat) => (
              <div key={chat._id} className="chatItem">
                <Link to={`/dashboard/chats/${chat._id}`}>{chat.title}</Link>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(chat._id)}
                >
                  Delete
                </button>
              </div>
            ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span>Upgrade to Linkly Pro</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
