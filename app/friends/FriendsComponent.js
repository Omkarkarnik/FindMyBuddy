// friends/FriendsComponent.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk

const FriendsComponent = ({ onChatClick }) => {
  const { user: clerkUser } = useUser(); // Use useUser to get the current user
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the friends list from the backend or database
  const fetchFriends = async () => {
    if (!clerkUser) return; // Ensure clerkUser is available
    try {
      const response = await fetch(`/api/friends-list?username=${encodeURIComponent(clerkUser.username)}`); // Use the correct endpoint with username
      if (!response.ok) {
        throw new Error('Failed to fetch friends');
      }
      const data = await response.json();
      setFriends(data.friends || []); // Default to an empty array if no friends
      setError(null); // Clear error if fetch is successful
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      setError('Failed to fetch friends. Please try again later.');
    }
  };

  useEffect(() => {
    fetchFriends(); // Fetch friends when the component mounts
  }, [clerkUser]);

  // Logic to remove a friend from the list
  const handleRemoveFriend = async (friend) => {
    try {
      const response = await fetch(`/api/friends-list`, { // Adjust endpoint and method as needed
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendUsername: friend.username }), // Use username to identify friend
      });

      if (response.ok) {
        // Update the state to remove friend from the UI
        setFriends((prevFriends) => prevFriends.filter((f) => f.username !== friend.username));
        alert(`${friend.fullName} has been removed from your friends list.`);
      } else {
        throw new Error('Failed to remove friend');
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '1rem',
        transform: 'translateY(-50%)',
        width: '350px',
        background: '#f9f9f9',
        padding: '0.9rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
        Friends List
      </Typography>
      {error ? (
        <Typography variant="body2" sx={{ color: 'red', textAlign: 'center' }}>
          {error}
        </Typography>
      ) : (
        friends.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666' }}>
            No friends yet
          </Typography>
        ) : (
          friends.map((friend, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                marginBottom: '0.5rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography variant="subtitle1">{friend.fullName}</Typography>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onChatClick(friend)}
                >
                  Chat
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={() => handleRemoveFriend(friend)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))
        )
      )}
    </Box>
  );
};

export default FriendsComponent;
